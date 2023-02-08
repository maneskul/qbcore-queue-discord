import { onPlayerConnect } from "./connect";

on('onResourceStart', (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    console.log(myRandomData)
    console.log('TypeScript boilerplate started!')
  }
})

AddEventHandler("playerConnecting", onPlayerConnect)