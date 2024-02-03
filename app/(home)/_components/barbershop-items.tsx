import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from "@prisma/client";
import Image from "next/image";

interface BarbershopItemsProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemsProps) => {
  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
      <CardContent className="p-0">
        <div className="p-1">
          <Image
            src={barbershop.imageUrl}
            height={0}
            width={0}
            sizes="100vw"
            className="h-[159px] w-full rounded-2xl"
            alt={""}
          />
        </div>
        <div className="p-1">
          <h2 className="mt-2 overflow-hidden text-ellipsis text-nowrap font-bold">
            {barbershop.name}
          </h2>
          <p className="overflow-hidden text-ellipsis text-nowrap text-sm text-gray-400">
            {barbershop.address}
          </p>
          <Button className="mt-3 w-full" variant="secondary">
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarbershopItem;
