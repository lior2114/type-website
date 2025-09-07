#!/usr/bin/env node

/**
 * Simple Admin Creation Script
 * This script creates the first admin user with predefined values
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDnlfZF01rKU6h80hsoxKTcWvl3Xcq81uk",
  authDomain: "typing-website-44c98.firebaseapp.com",
  projectId: "typing-website-44c98",
  storageBucket: "typing-website-44c98.firebasestorage.app",
  messagingSenderId: "683451576727",
  appId: "1:683451576727:web:7c6da6622588dbd17dd4d2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Default admin credentials - CHANGE THESE!
const ADMIN_CREDENTIALS = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@typing-tutor.com',
  password: 'admin123456'
};

// Check if admin already exists
const checkAdminExists = async () => {
  try {
    console.log('🔍 Checking for existing admin...');
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const hasAdmin = usersSnapshot.docs.some(doc => doc.data().role_name === 'admin');
    
    if (hasAdmin) {
      console.log('⚠️  Admin user already exists in the system!');
      console.log('To create additional admins, use the admin panel in the application.');
      return true;
    }
    
    console.log('✅ No admin found. Proceeding with creation...');
    return false;
  } catch (error) {
    console.error('❌ Error checking for existing admin:', error.message);
    return false;
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    console.log('\n🔄 Creating admin user...');
    console.log(`👤 Name: ${ADMIN_CREDENTIALS.firstName} ${ADMIN_CREDENTIALS.lastName}`);
    console.log(`📧 Email: ${ADMIN_CREDENTIALS.email}`);
    console.log(`🔑 Password: ${ADMIN_CREDENTIALS.password}`);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      ADMIN_CREDENTIALS.email, 
      ADMIN_CREDENTIALS.password
    );
    const uid = userCredential.user.uid;
    
    // Create user document in Firestore
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      first_name: ADMIN_CREDENTIALS.firstName,
      last_name: ADMIN_CREDENTIALS.lastName,
      user_email: ADMIN_CREDENTIALS.email,
      role_name: 'admin',
      created_at: serverTimestamp(),
      is_banned: false,
      profile_image: null,
      is_first_admin: true,
      created_by: 'system',
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log(`🆔 User ID: ${uid}`);
    console.log(`👑 Role: Admin`);
    console.log('\n📋 Login Credentials:');
    console.log(`Email: ${ADMIN_CREDENTIALS.email}`);
    console.log(`Password: ${ADMIN_CREDENTIALS.password}`);
    console.log('\n🎉 You can now login to the application with these credentials!');
    console.log('Access the admin panel to manage users and system settings.');
    
    return true;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n💡 The email is already in use. You can:');
      console.log('1. Use a different email address');
      console.log('2. Login with existing credentials');
      console.log('3. Reset the password in Firebase Console');
    }
    
    return false;
  }
};

// Main function
const main = async () => {
  console.log('🔥 Firebase Admin Creation Tool (Simple Version)');
  console.log('================================================\n');
  
  try {
    // Check if admin already exists
    const adminExists = await checkAdminExists();
    
    if (adminExists) {
      console.log('\n👋 Exiting...');
      return;
    }
    
    // Create the admin user
    const success = await createAdminUser();
    
    if (!success) {
      console.log('\n❌ Failed to create admin user.');
      console.log('Please check your Firebase configuration and try again.');
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure Firestore database exists');
      console.log('2. Check Firebase project configuration');
      console.log('3. Verify internet connection');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check Firebase configuration');
    console.log('2. Ensure Firestore database is created');
    console.log('3. Verify project permissions');
  }
};

// Run the script
main().catch(console.error);
