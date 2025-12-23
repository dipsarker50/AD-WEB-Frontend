"use client";
import { useParams } from 'next/navigation'

export default function ProductPage () {
      const router = useParams();
    return (
        <div>
            <h1>Product Page</h1>
            <p>Product ID: {router.id}</p>
        </div>
    );
}