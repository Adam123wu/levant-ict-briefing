import { cn } from "@/lib/utils";

export function Card({children,className=""}:{children:React.ReactNode,className?:string}) { return <section className={cn("card",className)}>{children}</section>; }
export function Badge({children,tone="default"}:{children:React.ReactNode,tone?:"default"|"green"|"amber"|"red"}) { return <span className={cn("badge",tone!=="default"&&tone)}>{children}</span>; }
