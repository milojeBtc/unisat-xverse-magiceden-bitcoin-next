import { NextRequest } from "next/server";
import qs from "qs";

// Fetch a inscriptions using wallet address
export async function POST(request: NextRequest) {
    try {
        const { 
            paymentAddress,
            paymentPublicKey,
            ordinalAddress,
            ordinalPublicKey,
            walletType ,
            hash
        } = await request.json();
        const axios = require("axios");

        let config = {
            method: "post",
            url: `${process.env.NEXT_PUBLIC_BACKEND}/api/walletConnect`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: qs.stringify({
                paymentAddress,
                paymentPublicKey,
                ordinalAddress,
                ordinalPublicKey,
                walletType,
                hash
            }),
        };

        const response = await axios.request(config);

        return Response.json(response.data);
    } catch (error) {
        console.error("Error creating user: ", error);
        return Response.json({ message: "Failed to create user" }, { status: 409 });
    }
}
