#!/usr/bin/env ruby
# add-ios-widget.rb — idempotently wires the native bridge plugin and the
# NousWidget WidgetKit extension into ios/App/App.xcodeproj.
#
# Usage: ruby scripts/add-ios-widget.rb
require 'xcodeproj'

ROOT = File.expand_path('..', __dir__)
PROJECT_PATH = File.join(ROOT, 'ios/App/App.xcodeproj')
TEAM_ID = '44BP374T6C'
APP_BUNDLE_ID = 'app.nous.studytracker'
WIDGET_NAME = 'NousWidget'

project = Xcodeproj::Project.open(PROJECT_PATH)
app = project.targets.find { |t| t.name == 'App' } or abort('App target not found')
app_group = project.main_group.children.find { |g| g.display_name == 'App' } or abort('App group not found')

def ensure_file(group, name)
  group.files.find { |f| f.path == name } || group.new_reference(name)
end

# --- App target: native plugin, bridge view controller, App Group entitlement ---
%w[NousNativePlugin.swift MainViewController.swift].each do |name|
  ref = ensure_file(app_group, name)
  app.source_build_phase.add_file_reference(ref, true)
end
ensure_file(app_group, 'App.entitlements')
app.build_configurations.each do |config|
  config.build_settings['CODE_SIGN_ENTITLEMENTS'] = 'App/App.entitlements'
end

# --- Widget extension target ---
widget = project.targets.find { |t| t.name == WIDGET_NAME }
unless widget
  widget = project.new_target(:app_extension, WIDGET_NAME, :ios, '15.0', nil, :swift)
  # new_target adds empty Frameworks/Resources phases; keep only what we use
  widget.frameworks_build_phase.clear
end

widget_group = project.main_group.children.find { |g| g.display_name == WIDGET_NAME } ||
               project.main_group.new_group(WIDGET_NAME, WIDGET_NAME)
swift_ref = ensure_file(widget_group, 'NousWidget.swift')
ensure_file(widget_group, 'Info.plist')
ensure_file(widget_group, 'NousWidget.entitlements')
widget.source_build_phase.add_file_reference(swift_ref, true)

app_settings = app.build_configurations.first.build_settings
widget.build_configurations.each do |config|
  config.build_settings.merge!(
    'PRODUCT_BUNDLE_IDENTIFIER' => "#{APP_BUNDLE_ID}.#{WIDGET_NAME}",
    'PRODUCT_NAME' => '$(TARGET_NAME)',
    'INFOPLIST_FILE' => "#{WIDGET_NAME}/Info.plist",
    'GENERATE_INFOPLIST_FILE' => 'NO',
    'CODE_SIGN_ENTITLEMENTS' => "#{WIDGET_NAME}/#{WIDGET_NAME}.entitlements",
    'CODE_SIGN_STYLE' => 'Automatic',
    'DEVELOPMENT_TEAM' => TEAM_ID,
    'IPHONEOS_DEPLOYMENT_TARGET' => '15.0',
    'SWIFT_VERSION' => '5.0',
    'TARGETED_DEVICE_FAMILY' => '1,2',
    'MARKETING_VERSION' => app_settings['MARKETING_VERSION'] || '1.0',
    'CURRENT_PROJECT_VERSION' => app_settings['CURRENT_PROJECT_VERSION'] || '1',
    'SKIP_INSTALL' => 'YES',
    'ENABLE_USER_SCRIPT_SANDBOXING' => 'NO',
    'LD_RUNPATH_SEARCH_PATHS' => '$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks'
  )
end

# --- Embed the extension in the app (before the CocoaPods embed script to avoid build cycles) ---
app.add_dependency(widget) unless app.dependencies.any? { |d| d.target == widget }
embed = app.copy_files_build_phases.find { |p| p.name == 'Embed Foundation Extensions' }
unless embed
  embed = project.new(Xcodeproj::Project::Object::PBXCopyFilesBuildPhase)
  embed.name = 'Embed Foundation Extensions'
  embed.symbol_dst_subfolder_spec = :plug_ins
  resources_index = app.build_phases.index(app.resources_build_phase)
  app.build_phases.insert(resources_index + 1, embed)
end
unless embed.files_references.include?(widget.product_reference)
  build_file = embed.add_file_reference(widget.product_reference, true)
  build_file.settings = { 'ATTRIBUTES' => ['RemoveHeadersOnCopy'] }
end

project.save
puts "✓ #{WIDGET_NAME} target and native bridge wired into #{File.basename(PROJECT_PATH)}"
