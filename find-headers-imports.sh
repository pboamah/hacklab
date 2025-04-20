#!/bin/bash

# Find all files that import from next/headers
echo "Files importing from next/headers:"
grep -r "from 'next/headers'" --include="*.tsx" --include="*.ts" .
grep -r 'from "next/headers"' --include="*.tsx" --include="*.ts" .

# Find all client components
echo -e "\nClient components (files with 'use client'):"
grep -r "use client" --include="*.tsx" --include="*.ts" .

# This will help identify which files might be causing the issue
