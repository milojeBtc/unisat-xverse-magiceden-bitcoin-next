"use client";

import { useState, useEffect, useContext } from "react";

import { RaffleProps } from "../utils/_type";
import { _raffleData } from "../utils/_data";
import RaffleCard from "@/app/components/RaffleCard";
import Link from "next/link";
import { fetchRaffles } from "@/app/hooks/use-raffle";
import { fetchRaffleHistory } from "@/app/hooks/use-raffle";
import WalletContext from "@/app/contexts/WalletContext";

import { Button } from "@nextui-org/react";

const RaffleMain = () => {
    const [sortRaffle, setFilterKey] = useState("all");
    const [processingRaffles, setProcessingRaffles] = useState([]);
    const [catagory, setCatagory] = useState(0);

    const [endRaffles, setEndRaffles] = useState([]);

    const {
        ordinalAddress,
    } = useContext(WalletContext);

    const getHistoryRaffles = async () => {
        const resp = await fetchRaffleHistory(ordinalAddress);
        console.log(resp);
        setEndRaffles(resp.raffles);
    };

    const getRaffles = async () => {
        const resp = await fetchRaffles();
        setProcessingRaffles(resp.raffles);
    };

    useEffect(() => {
        if (ordinalAddress) {
            getHistoryRaffles();
            getRaffles();
        }

    }, [ordinalAddress]);

    return (
        <>
            {ordinalAddress ? <div className="grid gap-3 p-3">
                <div>Raffle</div>
                <div className="flex gap-3">
                    <Button color={catagory == 0 ? 'primary' : 'default'} variant="bordered" onClick={() => setCatagory(0)}>
                        Process
                    </Button>
                    <Button color={catagory == 1 ? 'primary' : 'default'} variant="bordered" onClick={() => setCatagory(1)}>
                        Ended
                    </Button>
                </div>
                {catagory == 0 ?
                    <div className="grid grid-cols-4 gap-3">
                        {processingRaffles.map((raffle: RaffleProps, index: number) => (
                            <Link key={index} href={`/pages/raffle/${raffle.ordinalInscription}`}>
                                <RaffleCard raffle={raffle} />
                            </Link>
                        ))}
                    </div>
                    :
                    <></>}
                {catagory == 1 ?
                    <div className="grid grid-cols-4 gap-3">
                        {endRaffles.map((raffle: RaffleProps, index: number) => (
                            <Link key={index} href={`/pages/raffle/${raffle.ordinalInscription}`}>
                                <RaffleCard raffle={raffle} />
                            </Link>
                        ))}
                    </div>
                    :
                    <></>}

            </div> : <div className="text-center">Connect Wallet First</div>}
        </>

    );
};

export default RaffleMain;
