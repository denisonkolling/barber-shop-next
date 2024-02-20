"use client";

import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isBookingConfirmed = isFuture(booking.date);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleCancelClick = async () => {
    try {
      setIsDeleteLoading(true);
      await cancelBooking(booking.id);

      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      toast.error("Ocorreu um erro ao cancelar a reserva");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="p-0">
          <CardContent className="flex justify-between py-0 pr-1">
            <div className="flex flex-col gap-2 py-5">
              <Badge
                variant={isBookingConfirmed ? "default" : "secondary"}
                className="w-fit"
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />

                  <AvatarFallback>A</AvatarFallback>
                </Avatar>

                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-solid border-secondary px-3">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "hh:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Informações da Reserva
            <div className="px-5">
              <div className="relative mt-6 h-[180px] w-full">
                <Image src="/map.png" fill alt={booking.barbershop.name} />

                <div className="absolute bottom-4 left-0 w-full px-5">
                  <Card>
                    <CardContent className="flex gap-2 p-3">
                      <Avatar>
                        <AvatarImage src={booking.barbershop.imageUrl} />
                      </Avatar>

                      <div>
                        <h2 className="font-bold">{booking.barbershop.name}</h2>
                        <h3 className="overflow-hidden text-ellipsis text-nowrap text-xs">
                          {booking.barbershop.address}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Badge
                variant={isBookingConfirmed ? "default" : "secondary"}
                className="my-4 flex w-fit justify-start"
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>

              <Card>
                <CardContent className="flex flex-col gap-3 p-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold">{booking.service.name}</h2>
                    <h3 className="text-sm font-bold">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(booking.service.price))}
                    </h3>
                  </div>

                  <div className="flex justify-between">
                    <h3 className="text-sm text-gray-400">Data</h3>
                    <h4 className="text-sm">
                      {format(booking.date, "dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </h4>
                  </div>

                  <div className="flex justify-between">
                    <h3 className="text-sm text-gray-400">Horário</h3>

                    <h4 className="text-sm">{format(booking.date, "hh:mm")}</h4>
                  </div>

                  <div className="flex justify-between">
                    <h3 className="text-sm text-gray-400">Barbearia</h3>
                    <h4 className="text-sm">{booking.barbershop.name}</h4>
                  </div>
                </CardContent>
              </Card>

              <SheetFooter className="mt-6 flex-row gap-3">
                <SheetClose asChild>
                  <Button className="w-full" variant="secondary">
                    Voltar
                  </Button>
                </SheetClose>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant="destructive"
                      disabled={!isBookingConfirmed || isDeleteLoading}
                    >
                      Cancelar Reserva
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-center">
                        Deseja cancelar sua reserva?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Uma vez cancelada não sera possível reverter esta ação.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-3">
                      <AlertDialogCancel className="mt-0 w-full">
                        Voltar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="w-full"
                        onClick={handleCancelClick}
                        disabled={isDeleteLoading}
                      >
                        {isDeleteLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Cancelar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SheetFooter>
            </div>
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
