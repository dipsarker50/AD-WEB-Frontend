import Link from 'next/link';
import Image from "next/image";


export default function Header({logo}: {logo: string}) {
    return (
        <nav>
            <Image src={logo} alt="Logo" width={50} height={50} />
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/signin">Sign In</Link></li>
                    <li><Link href="/register">Register</Link></li>
                </ul>
        </nav>
    );
}