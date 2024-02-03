import BarbershopItem from "@/app/(home)/_components/barbershop-items";
import { db } from "@/app/_lib/prisma";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
  if (!params.id) {
    //TODO: redirecionar para home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!barbershop) {
    //TODO: redirecionar para home page
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div key={barbershop.id} className="w-full">
        <BarbershopItem barbershop={barbershop} />
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;
