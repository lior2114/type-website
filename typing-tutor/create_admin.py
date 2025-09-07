#!/usr/bin/env python3
"""
Firebase Admin Creation Tool
Creates admin user directly in Firebase without any code copying
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import requests
import json
import threading
import webbrowser
import sys
import os

class FirebaseAdminCreator:
    def __init__(self, root):
        self.root = root
        self.root.title("🔥 Firebase Admin Creation Tool")
        self.root.geometry("600x700")
        self.root.resizable(False, False)
        
        # Set window style
        self.root.configure(bg='#f0f0f0')
        
        # Firebase configuration
        self.firebase_config = {
            "apiKey": "AIzaSyDnlfZF01rKU6h80hsoxKTcWvl3Xcq81uk",
            "authDomain": "typing-website-44c98.firebaseapp.com",
            "projectId": "typing-website-44c98"
        }
        
        # Create GUI
        self.create_widgets()
    
    def create_widgets(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="🔥 Firebase Admin Creation Tool", 
                               font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Status frame
        status_frame = ttk.LabelFrame(main_frame, text="Status", padding="10")
        status_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 20))
        
        self.status_label = ttk.Label(status_frame, text="✅ Ready to create admin user", 
                                     font=('Arial', 10))
        self.status_label.grid(row=0, column=0, sticky=tk.W)
        
        # Admin details frame
        details_frame = ttk.LabelFrame(main_frame, text="Admin Details", padding="15")
        details_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 20))
        
        # First name
        ttk.Label(details_frame, text="First Name:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.first_name_var = tk.StringVar(value="Admin")
        first_name_entry = ttk.Entry(details_frame, textvariable=self.first_name_var, width=30)
        first_name_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), pady=5, padx=(10, 0))
        
        # Last name
        ttk.Label(details_frame, text="Last Name:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.last_name_var = tk.StringVar(value="User")
        last_name_entry = ttk.Entry(details_frame, textvariable=self.last_name_var, width=30)
        last_name_entry.grid(row=1, column=1, sticky=(tk.W, tk.E), pady=5, padx=(10, 0))
        
        # Email
        ttk.Label(details_frame, text="Email:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.email_var = tk.StringVar(value="admin@typing-tutor.com")
        email_entry = ttk.Entry(details_frame, textvariable=self.email_var, width=30)
        email_entry.grid(row=2, column=1, sticky=(tk.W, tk.E), pady=5, padx=(10, 0))
        
        # Password
        ttk.Label(details_frame, text="Password:").grid(row=3, column=0, sticky=tk.W, pady=5)
        self.password_var = tk.StringVar(value="admin123456")
        password_entry = ttk.Entry(details_frame, textvariable=self.password_var, 
                                  show="*", width=30)
        password_entry.grid(row=3, column=1, sticky=(tk.W, tk.E), pady=5, padx=(10, 0))
        
        # Show password checkbox
        self.show_password_var = tk.BooleanVar()
        show_password_check = ttk.Checkbutton(details_frame, text="Show Password", 
                                            variable=self.show_password_var,
                                            command=lambda: self.toggle_password_visibility(password_entry))
        show_password_check.grid(row=4, column=1, sticky=tk.W, pady=5, padx=(10, 0))
        
        # Configure grid weights
        details_frame.columnconfigure(1, weight=1)
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.grid(row=3, column=0, columnspan=2, pady=(0, 20))
        
        # Create admin button
        self.create_button = ttk.Button(buttons_frame, text="👑 Create Admin", 
                                       command=self.create_admin)
        self.create_button.grid(row=0, column=0, padx=(0, 10))
        
        # Clear form button
        self.clear_button = ttk.Button(buttons_frame, text="🗑️ Clear Form", 
                                      command=self.clear_form)
        self.clear_button.grid(row=0, column=1, padx=(10, 0))
        
        # Open browser button
        self.browser_button = ttk.Button(buttons_frame, text="🌐 Open Firebase Console", 
                                        command=self.open_firebase_console)
        self.browser_button.grid(row=0, column=2, padx=(10, 0))
        
        # Progress bar
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate')
        self.progress.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 20))
        
        # Log frame
        log_frame = ttk.LabelFrame(main_frame, text="Log", padding="10")
        log_frame.grid(row=5, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 20))
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=12, width=70)
        self.log_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(5, weight=1)
        log_frame.columnconfigure(0, weight=1)
        log_frame.rowconfigure(0, weight=1)
        
        # Store password entry reference
        self.password_entry = password_entry
    
    def toggle_password_visibility(self, password_entry):
        if self.show_password_var.get():
            password_entry.configure(show="")
        else:
            password_entry.configure(show="*")
    
    def log_message(self, message):
        """Add message to log"""
        self.log_text.insert(tk.END, f"{message}\n")
        self.log_text.see(tk.END)
        self.root.update_idletasks()
    
    def validate_form(self):
        """Validate form inputs"""
        errors = []
        
        if not self.first_name_var.get().strip():
            errors.append("First name is required")
        
        if not self.last_name_var.get().strip():
            errors.append("Last name is required")
        
        email = self.email_var.get().strip()
        if not email:
            errors.append("Email is required")
        elif "@" not in email or "." not in email:
            errors.append("Invalid email format")
        
        password = self.password_var.get()
        if not password:
            errors.append("Password is required")
        elif len(password) < 6:
            errors.append("Password must be at least 6 characters")
        
        return errors
    
    def create_admin(self):
        """Create admin user using Firebase REST API"""
        # Validate form
        errors = self.validate_form()
        if errors:
            messagebox.showerror("Validation Error", "\n".join(errors))
            return
        
        # Confirm creation
        result = messagebox.askyesno("Confirm Creation", 
            f"Create admin user with these details?\n\n"
            f"Name: {self.first_name_var.get()} {self.last_name_var.get()}\n"
            f"Email: {self.email_var.get()}\n"
            f"Password: {'*' * len(self.password_var.get())}")
        
        if not result:
            return
        
        def create_thread():
            try:
                self.root.after(0, lambda: self.progress.start())
                self.root.after(0, lambda: self.create_button.config(state='disabled'))
                self.root.after(0, lambda: self.status_label.config(text="🔄 Creating admin user..."))
                self.root.after(0, lambda: self.log_message("🔄 Starting admin creation process..."))
                
                # Step 1: Create user in Firebase Auth
                self.root.after(0, lambda: self.log_message("📧 Creating user in Firebase Auth..."))
                
                auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={self.firebase_config['apiKey']}"
                auth_data = {
                    "email": self.email_var.get(),
                    "password": self.password_var.get(),
                    "returnSecureToken": True
                }
                
                auth_response = requests.post(auth_url, json=auth_data)
                auth_result = auth_response.json()
                
                if not auth_response.ok:
                    error_msg = auth_result.get('error', {}).get('message', 'Unknown error')
                    if 'EMAIL_EXISTS' in error_msg:
                        self.root.after(0, lambda: self.log_message("⚠️ Email already exists. Trying to sign in..."))
                        # Try to sign in instead
                        signin_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={self.firebase_config['apiKey']}"
                        signin_response = requests.post(signin_url, json=auth_data)
                        if signin_response.ok:
                            auth_result = signin_response.json()
                            self.root.after(0, lambda: self.log_message("✅ Successfully signed in with existing account"))
                        else:
                            raise Exception(f"Email exists but password is wrong: {error_msg}")
                    else:
                        raise Exception(f"Auth error: {error_msg}")
                else:
                    self.root.after(0, lambda: self.log_message("✅ User created in Firebase Auth"))
                
                user_id = auth_result['localId']
                id_token = auth_result['idToken']
                
                # Step 2: Create user document in Firestore
                self.root.after(0, lambda: self.log_message("📄 Creating user document in Firestore..."))
                
                firestore_url = f"https://firestore.googleapis.com/v1/projects/{self.firebase_config['projectId']}/databases/(default)/documents/users/{user_id}"
                
                user_data = {
                    "fields": {
                        "first_name": {"stringValue": self.first_name_var.get()},
                        "last_name": {"stringValue": self.last_name_var.get()},
                        "user_email": {"stringValue": self.email_var.get()},
                        "role_name": {"stringValue": "admin"},
                        "is_banned": {"booleanValue": False},
                        "profile_image": {"nullValue": None},
                        "is_first_admin": {"booleanValue": True},
                        "created_by": {"stringValue": "system"}
                    }
                }
                
                firestore_headers = {
                    "Authorization": f"Bearer {id_token}",
                    "Content-Type": "application/json"
                }
                
                firestore_response = requests.patch(firestore_url, json=user_data, headers=firestore_headers)
                
                if firestore_response.ok:
                    self.root.after(0, lambda: self.log_message("✅ User document created in Firestore"))
                    self.root.after(0, lambda: self.log_message("🎉 Admin user created successfully!"))
                    
                    # Show success message
                    self.root.after(0, lambda: messagebox.showinfo("Success", 
                        f"Admin user created successfully!\n\n"
                        f"User ID: {user_id}\n"
                        f"Email: {self.email_var.get()}\n"
                        f"Password: {self.password_var.get()}\n\n"
                        "You can now login to the application!"))
                    
                    self.root.after(0, lambda: self.status_label.config(text="✅ Admin created successfully!"))
                    
                else:
                    firestore_error = firestore_response.json()
                    error_msg = firestore_error.get('error', {}).get('message', 'Unknown Firestore error')
                    raise Exception(f"Firestore error: {error_msg}")
                
            except Exception as e:
                error_msg = str(e)
                self.root.after(0, lambda: self.log_message(f"❌ Error: {error_msg}"))
                self.root.after(0, lambda: self.status_label.config(text="❌ Error creating admin"))
                
                if "EMAIL_EXISTS" in error_msg:
                    self.root.after(0, lambda: messagebox.showerror("Email Exists", 
                        "This email already exists in the system.\n"
                        "Please use a different email or try to login with existing credentials."))
                elif "INVALID_EMAIL" in error_msg:
                    self.root.after(0, lambda: messagebox.showerror("Invalid Email", 
                        "The email format is invalid.\nPlease enter a valid email address."))
                elif "WEAK_PASSWORD" in error_msg:
                    self.root.after(0, lambda: messagebox.showerror("Weak Password", 
                        "The password is too weak.\nPlease use a stronger password (at least 6 characters)."))
                else:
                    self.root.after(0, lambda: messagebox.showerror("Error", 
                        f"Error creating admin: {error_msg}\n\n"
                        "Please check:\n"
                        "1. Internet connection\n"
                        "2. Firebase project configuration\n"
                        "3. Firestore database exists"))
            
            finally:
                self.root.after(0, lambda: self.progress.stop())
                self.root.after(0, lambda: self.create_button.config(state='normal'))
        
        thread = threading.Thread(target=create_thread, daemon=True)
        thread.start()
    
    def clear_form(self):
        """Clear all form fields"""
        self.first_name_var.set("")
        self.last_name_var.set("")
        self.email_var.set("")
        self.password_var.set("")
        self.show_password_var.set(False)
        self.password_entry.configure(show="*")
        self.log_text.delete(1.0, tk.END)
        self.status_label.config(text="✅ Ready to create admin user")
    
    def open_firebase_console(self):
        """Open Firebase Console in browser"""
        webbrowser.open("https://console.firebase.google.com/project/typing-website-44c98")

def main():
    # Check if required modules are available
    try:
        import requests
    except ImportError:
        print("❌ 'requests' module not found!")
        print("Install it with: pip install requests")
        sys.exit(1)
    
    root = tk.Tk()
    app = FirebaseAdminCreator(root)
    
    # Center window on screen
    root.update_idletasks()
    x = (root.winfo_screenwidth() // 2) - (root.winfo_width() // 2)
    y = (root.winfo_screenheight() // 2) - (root.winfo_height() // 2)
    root.geometry(f"+{x}+{y}")
    
    root.mainloop()

if __name__ == "__main__":
    main()
