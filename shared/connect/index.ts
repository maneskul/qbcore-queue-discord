import { QBCore } from "../helpers";

export const onPlayerConnect = (name: string, kickReason: any, defferals: any) => {
    const { PlayerData } = QBCore;
    const { playerName } = PlayerData;
    console.log(PlayerData);
    console.log("[MESSAGE] TESTE");
    const connectTime = Date.now();
    var connecting = true;

    defferals.defer();

    while (connecting) {
        Wait(100);
        if (!connecting) { return; }
        defferals.update("Conectando...");
    }

    Wait(500);
};