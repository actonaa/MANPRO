/* eslint-disable @typescript-eslint/no-explicit-any */
import NotifikasiItem from "./NotifikasiItem";

export default function NotifikasiList({ data }: { data: any[] }) {
  return (
    <div>
      {data.map((notif) => (
        <NotifikasiItem key={notif.id} notif={notif} />
      ))}
    </div>
  );
}
