"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Service } from "@prisma/client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { ptBR } from "date-fns/locale";

interface ServiceItemsProps {
  service: Service;
  isAuthenticated?: boolean;
}

const ServiceItem = ({ service, isAuthenticated }: ServiceItemsProps) => {
  
  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
  };

  return (
    <Card>
      <CardContent className="w-full p-3">
        <div className="flex w-full items-center gap-4">
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              className="rounded-lg"
              src={service.imageUrl}
              fill
              style={{ objectFit: "contain" }}
              alt={service.name}
            />
          </div>

          <div className="flex w-full flex-col">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="border-b border-solid border-secondary px-5 py-6 text-left">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    locale={ptBR}
                    fromDate={new Date()}
                    styles={{
                      head_cell: { width: "100%", textTransform: "capitalize", },
                      cell: { width: "100%", },
                      button: { width: "100%", },
                      nav_button_previous: { width: "32px", height: "32px", },
                      nav_button_next: { width: "32px", height: "32px", },
                      caption: { textTransform: "capitalize", },
                    }}
                  />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
