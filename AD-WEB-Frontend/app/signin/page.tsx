'use client'
import axios from "axios";
export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log('Login submitted');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="text" id="email" name="email"/>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" id="password" name="password"/>
        </div>
        <input type="submit" value="Login"/>
      </form>
    </div>
  );
}
