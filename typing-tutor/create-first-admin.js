#!/usr/bin/env node

/**
 * Create First Admin Script
 * This script helps create the first admin user for the typing tutor application
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import readline from 'readline';

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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

// Helper function to ask for password (hidden input)
const askPassword = (question) => {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    process.stdin.on('data', function(char) {
      char = char + '';
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeAllListeners('data');
          console.log('');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
};

// Check if admin already exists
const checkAdminExists = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const hasAdmin = usersSnapshot.docs.some(doc => doc.data().role_name === 'admin');
    return hasAdmin;
  } catch (error) {
    console.error('❌ Error checking for existing admin:', error.message);
    return false;
  }
};

// Create admin user
const createAdminUser = async (firstName, lastName, email, password) => {
  try {
    console.log('\n🔄 Creating admin user...');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Create user document in Firestore
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      first_name: firstName,
      last_name: lastName,
      user_email: email,
      role_name: 'admin',
      created_at: serverTimestamp(),
      is_banned: false,
      profile_image: null,
      is_first_admin: true,
      created_by: 'system',
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`👤 Name: ${firstName} ${lastName}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🆔 User ID: ${uid}`);
    console.log(`👑 Role: Admin`);
    
    return true;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    return false;
  }
};

// Main function
const main = async () => {
  console.log('🔥 Firebase Admin Creation Tool');
  console.log('================================\n');
  
  try {
    // Check if admin already exists
    console.log('🔍 Checking for existing admin...');
    const adminExists = await checkAdminExists();
    
    if (adminExists) {
      console.log('⚠️  Admin user already exists in the system!');
      console.log('Only one admin can be created through this script.');
      console.log('To create additional admins, use the admin panel in the application.\n');
      
      const continueChoice = await askQuestion('Do you want to continue anyway? (y/N): ');
      if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
        console.log('👋 Exiting...');
        rl.close();
        return;
      }
    }
    
    // Get admin details
    console.log('\n📝 Please provide admin details:');
    
    const firstName = await askQuestion('First Name: ');
    if (!firstName.trim()) {
      console.log('❌ First name is required!');
      rl.close();
      return;
    }
    
    const lastName = await askQuestion('Last Name: ');
    if (!lastName.trim()) {
      console.log('❌ Last name is required!');
      rl.close();
      return;
    }
    
    const email = await askQuestion('Email: ');
    if (!email.trim() || !email.includes('@')) {
      console.log('❌ Valid email is required!');
      rl.close();
      return;
    }
    
    const password = await askPassword('Password (min 6 characters): ');
    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      rl.close();
      return;
    }
    
    const confirmPassword = await askPassword('Confirm Password: ');
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match!');
      rl.close();
      return;
    }
    
    // Confirm creation
    console.log('\n📋 Admin Details:');
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Role: Admin`);
    
    const confirm = await askQuestion('\nCreate this admin user? (y/N): ');
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('👋 Cancelled.');
      rl.close();
      return;
    }
    
    // Create the admin user
    const success = await createAdminUser(firstName, lastName, email, password);
    
    if (success) {
      console.log('\n🎉 Admin user created successfully!');
      console.log('You can now login to the application with these credentials.');
      console.log('Access the admin panel to manage users and system settings.\n');
    } else {
      console.log('\n❌ Failed to create admin user.');
      console.log('Please check your Firebase configuration and try again.\n');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    rl.close();
  }
};

// Run the script
main().catch(console.error);
