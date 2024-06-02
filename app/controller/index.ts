export const writeHistory = async (paymentAddress: string, amountToTransfer: number, txId: string, walletType: string) => {
    console.log("fetching faffles");
    const response = await fetch(`/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            paymentAddress,
            amountToTransfer,
            txId,
            walletType
        }),
    });
    console.log(response);
    if (response.status == 200) {
        const data = await response.json();
        return data;
    } else {
        return undefined;
    }
};