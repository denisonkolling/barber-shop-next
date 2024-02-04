"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data } = useSession();

  const handleLoginClick = async () => {
    await signIn();
  };

  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/">
          <Image src="/logo.png" alt="FSW Barber" height={18} width={120} />
        </Link>

        {data?.user ? (
          <div>
            <span className="px-2">{data.user.name}</span>
            <Button onClick={() => signOut()}>Logout</Button>
          </div>
        ) : (
          <Button onClick={handleLoginClick}>Login</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Header;
