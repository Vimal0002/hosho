# ElectroMinds Chatbot - User Guide

## 1. Getting Started
The application is currently running at: **http://localhost:3001**

## 2. Setting Up Email (Crucial!)
The email test failed because Google requires an **App Password**, not your regular login password.

1.  Go to your **Google Account** -> **Security**.
2.  Enable **2-Step Verification** if not already on.
3.  Search for **"App Passwords"**.
4.  Create a new one named "ElectroMinds".
5.  Copy the 16-character code (e.g., `abcd efgh ijkl mnop`).
6.  Open `.env.local` in your project folder.
7.  Update `EMAIL_PASS` with this code (remove spaces if you want, but they usually work).
    ```env
    EMAIL_USER="your-email@gmail.com"
    EMAIL_PASS="abcd efgh ijkl mnop"
    ```
8.  Restart the server:
    *   Press `Ctrl + C` in the terminal to stop.
    *   Run `npm run dev` again.

## 3. Features to Test

### A. Sweet & Simple UI 🌸
*   Check if the background is a soft pink/yellow mix.
*   Chat bubbles should be clean and friendly.

### B. Buying Products 🛒
*   **Contextual Buying**:
    1.  Type: `Show me phones` (or just `Show products`).
    2.  User: `Buy 23` (Assuming '23' is a product ID you see).
    3.  Bot: Should ask for delivery details.
    4.  User: `123 Main St, Credit Card`.
    5.  Bot: Confirm order?
    6.  User: `Yes`.
    *   *Result*: Order placed, Email sent (if setup is done).

### C. Tracking Orders 🚚
*   Copy the **Order ID** from the previous step.
*   Type: `Track [Order ID]`.
*   *Result*: Should show status, items, and total.

### D. Return Order ↩️
*   Type: `Return [Order ID]`.
*   Bot: Should ask for a reason.
*   User: `Screen is cracked`.
*   Bot: Ask to confirm.
*   User: `Yes`.
*   *Result*: Return request processed.

### E. Cancel Order ❌
*   Type: `Cancel [Order ID]`.
*   Bot: Confirm cancellation?
*   User: `Yes`.
*   *Result*: Order cancelled, stock restored.

## 4. Troubleshooting
*   **Email not sending?** Check the terminal for errors. It's usually the App Password.
*   **Bot getting stuck?** Refresh the page. The local session might need a clear.
