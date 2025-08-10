# Dynamic Form Builder

<br>

## Overview

A React + TypeScript application that lets users create, customize, preview, and save forms dynamically.
Forms are stored in the browser’s localStorage for persistence, with a clean Material UI interface.

## Tech Stack

- **React (TypeScript)** – Component-based UI
- **Redux Toolkit** – State management
- **Material UI (MUI)** – Modern, responsive components
- **UUID** – Unique ID generation for form fields
- **LocalStorage** – Persistent storage without a backend
  
## Features

- **Add Multiple Field Types** – Text, Number, Textarea, Select, Radio, Checkbox, Date
- **Field Validation Rules** – Required, min/max length, min/max value, email, password
- **Drag-Like Reordering** – Move fields up or down
- **Custom Options** – Add/remove select, radio, or checkbox options
- **Live Preview** – See how the form will look before saving
- **Local Save** – Save forms in localStorage with unique names
- **Form Submission Validation** – Ensures rules are followed before submission

## Project Preview

<p align="center">
  <img src="https://github.com/user-attachments/assets/b91e4731-4592-4741-b0e0-f0ed76ab091e" alt="Screenshot 1" width="45%" />
  <img src="https://github.com/user-attachments/assets/20cd61ec-310d-495d-a153-5db78b126d89" alt="Screenshot 2" width="45%" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/adab83fa-2b5b-4cb2-9850-d751ea2f6d00" alt="Screenshot 3" width="45%" />
  <img src="https://github.com/user-attachments/assets/77ab4c53-36de-478f-976c-20c2bfab15d9" alt="Screenshot 4" width="45%" />
</p>

---

## Installation

### Clone the repository:

  ```bash
  git clone https://github.com/ssln-arun/dynamic-form-builder.git
  cd dynamic-form-builder
  ```
### Install Dependencies:
  
  ```bash
  npm install
  ```

### Start the Development Server:

  ```bash
  npm run dev
  ```
Open http://localhost:5173/ in your browser.

## Usage

- When you **save a form**, it’s stored in the browser’s **localStorage**.
- You can have **multiple saved forms** with **different names**.
- **Saved forms** persist even after **refreshing the page**.
  
