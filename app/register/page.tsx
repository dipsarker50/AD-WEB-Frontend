"use client";
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import axios,{isAxiosError} from 'axios';
import Link from 'next/link';

const agentRegisterSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .regex(/^[A-Za-z\s]+$/, 'Name should only contain alphabets'),
  
  address: z.string()
    .min(1, 'Address is required'),
  
  email: z.string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.(xyz|com)$/, 'Email must be a valid .xyz or .com domain email'),
  
  password: z.string()
    .min(1, 'Password is required')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 8 characters long and contain both letters and numbers'),
  
  phone: z.string()
    .min(1, 'Phone number is required'),
  
  age: z.string()
    .min(1, 'Age is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 18, {
      message: 'Age must be at least 18',
    }),
  
  nidNumber: z.string()
    .min(1, 'NID number is required')
    .regex(/^\d{10}$|^\d{13}$|^\d{17}$/, 'NID must be 10, 13, or 17 digits long'),
  
  experience: z.string().optional(),
  bio: z.string().optional(),
  nidImage: z.any().optional(),

});

type AgentRegisterForm = z.infer<typeof agentRegisterSchema>;

export default function Register() {
  
  const [fullName,setFullName]=useState('');
  const [address,setAddress]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [phone,setPhone]=useState('');
  const [age,setAge]=useState('');
  const [nidNumber,setNidNumber]=useState('');
  const [experience,setExperience]=useState('');
  const [bio,setBio]=useState('');
  const [nidImage,setNidImage]=useState<File | null>(null);


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();



  const handleSubmit = (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      agentRegisterSchema.parse({ fullName, address, email, password, phone, age, nidNumber, experience, bio, nidImage });
      console.log('Form submitted successfully:');
      setErrors({});
      
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }




    const submitData = async () => {
    
    try {

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('address', address);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('nidNumber', nidNumber);
      formData.append('experience', experience);
      formData.append('bio', bio);
      formData.append('age', age.toString());

     console.log('Submitting form data:', formData);

      const response  = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/agent/signup', formData,{headers: {
        'Content-Type': 'application/json'
      }});

      setSuccess(true);
      setLoading(false);


      
      setErrors({});
      setFullName('');
      setAddress('');
      setEmail('');
      setPassword('');
      setPhone('');
      setNidNumber('');
      setExperience('');
      setBio('');
      setAge('');
      setNidImage(null);
      router.push('/email-verify?email=' + email);


      
    } catch (error) {
      if (isAxiosError(error)) {
        setLoading(false);
        setErrors({ apiError: error.response?.data.message });
        console.log('API Error:', error.response );
      } else {
        console.log('Unexpected Error:', error);
      }
    }
  }

      submitData();
}

  return (
    <div className="lg:m-10">
      <form onSubmit={handleSubmit} className="relative border border-gray-100 space-y-3 max-w-screen-md mx-auto rounded-md bg-white p-6 shadow-xl lg:p-10">
        <h1 className="mb-6 text-xl font-semibold lg:text-2xl">Agent Register</h1>
        <div> {errors.apiError && <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>} </div>
         <div> {success && <p className="text-green-500 text-sm mt-1">Registration successful!</p>} </div>

        {/* Full Name */}
        <div>
          <label className="block mb-1">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1">Address <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        {/* Email and Phone */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block mb-1">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1">Phone <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phone"
              value={phone}
              placeholder="Enter phone number"
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Age and NID Number */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block mb-1">Age <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block mb-1">NID Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="nidNumber"
              value={nidNumber}
              onChange={(e) => setNidNumber(e.target.value)}
              placeholder="10, 13, or 17 digits"
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
            {errors.nidNumber && <p className="text-red-500 text-sm mt-1">{errors.nidNumber}</p>}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-1">Experience (Optional)</label>
          <textarea
            name="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Describe your experience"
            rows={3}
            className="mt-2 w-full rounded-md bg-gray-100 px-3 py-2"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1">Bio (Optional)</label>
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            rows={3}
            className="mt-2 w-full rounded-md bg-gray-100 px-3 py-2"
          />
        </div>



        {/* Terms and Conditions */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="terms" required />
          <label>
            I agree to the{" "}
            <Link href="#" className="text-blue-600">
              Terms and Conditions
            </Link>
            <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-md bg-blue-600 p-2 text-center font-semibold text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
}
