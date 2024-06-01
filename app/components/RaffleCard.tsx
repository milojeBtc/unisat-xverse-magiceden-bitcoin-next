"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";

const RaffleCard = ({ raffle }: { raffle: any }) => {
  return (
    <Card className="relative py-4 cursor-pointer">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{raffle.name}</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          width={300}
          height={300}
          src={`${process.env.NEXT_PUBLIC_ORDINAL_URL}/${raffle.ordinalInscription}`}
        />
      </CardBody>
    </Card>
  );
};

export default RaffleCard;
