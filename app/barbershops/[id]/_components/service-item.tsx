"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Service, Barbershop } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { ptBR } from "date-fns/locale";
import { generateDayTimeList } from "../_helpers/hours";
import { format } from "date-fns";
import { setMinutes, setHours } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated?: boolean;
}

const ServiceItem = ({ service, barbershop, isAuthenticated,}: ServiceItemProps) => {
  
  const { data } = useSession();

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
  };

  const handleHourClick = (time: string | undefined) => {
    setHour(time);
  };

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : [];
  }, [date]);

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);

    try {
      if (!hour || !date || !data?.user) {
        return;
      }

      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data.user as any).id,
      });

      setSheetIsOpen(false);
      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.replace("/"),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }
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
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="px-5 py-6 text-left">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <div className="border-t py-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      locale={ptBR}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: { width: "100%" },
                        button: { width: "100%" },
                        nav_button_previous: { width: "32px", height: "32px" },
                        nav_button_next: { width: "32px", height: "32px" },
                        caption: { textTransform: "capitalize" },
                      }}
                    />

                    {date && (
                      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-solid border-secondary px-5 py-6">
                        {timeList.map((time) => (
                          <Button
                            className="gap-2 rounded-full"
                            key={time}
                            variant={hour === time ? "default" : "outline"}
                            onClick={() => handleHourClick(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-solid border-secondary px-5 py-6">
                      <Card>
                        <CardContent className="flex flex-col gap-3 p-3">
                          <div className="flex justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <h3 className="text-sm font-bold">
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(service.price))}
                            </h3>
                          </div>

                          {date && (
                            <div className="flex justify-between">
                              <h3 className="text-sm text-gray-400">Data</h3>
                              <h4 className="text-sm">
                                {format(date, "dd 'de' MMMM", {
                                  locale: ptBR,
                                })}
                              </h4>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Horário</h3>
                            {hour ? (
                              <h4 className="text-sm">{hour}</h4>
                            ) : (
                              <h4 className="text-sm">Selecione</h4>
                            )}
                          </div>

                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Barbearia</h3>
                            <h4 className="text-sm">{barbershop.name}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <SheetFooter className="px-5">
                      <Button
                        onClick={handleBookingSubmit}
                        disabled={!hour || !date || submitIsLoading}
                      >
                        {submitIsLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirmar reserva
                      </Button>
                    </SheetFooter>
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
