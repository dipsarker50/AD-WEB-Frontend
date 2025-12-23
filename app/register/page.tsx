"use client";

export default function Register() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log('Register submitted');
  };

  return (
      <div>
        <h1>Agent Registration</h1>
        <p>* indicates required fields</p>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label>Full Name *</label>
            <input type="text" id="fullName" name="fullName" />
          </div>

          <div>
            <label>Email *</label>
            <input type="email" id="email" name="email" />
          </div>

          <div>
            <label>Password *</label>
            <input type="password" id="password" name="password" />
          </div>

          <div>
            <label>Address *</label>
            <input type="text" id="address" name="address" />
          </div>

          <div>
            <label>Phone *</label>
            <input type="tel" id="phone" name="phone" />
          </div>

          <div>
            <label>Age *</label>
            <input type="number" id="age" name="age" min="18" />
          </div>

          <div>
            <label>NID Number *</label>
            <input type="text" id="nidNumber" name="nidNumber" placeholder="10, 13, or 17 digits" />
          </div>

          <div>
            <label>Experience</label>
            <input type="text" id="experience" name="experience" />
          </div>

          <div>
            <label>Bio</label>
            <textarea id="bio" name="bio" rows={4}></textarea>
          </div>

          <div>
            <label>NID Image</label>
            <input type="file" id="nidImage" name="nidImage" accept="image/*" />
          </div>

          <input type="submit" value="Register" />
        </form>
      </div>

  );
}
