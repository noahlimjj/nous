#!/bin/bash

# Simple script to set noahlim as admin using Firebase CLI
# This uses the Firebase project you're already authenticated with

echo "Setting noahlim as admin..."

# Use Firebase CLI to update Firestore directly
# First, we need to find the user's UID by querying for username "noahlim"

firebase firestore:write "users" --data '{"admin": true}' --query 'username == "noahlim"'

echo "Done! noahlim should now have admin privileges."
