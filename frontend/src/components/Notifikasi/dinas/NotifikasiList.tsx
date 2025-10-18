import NotifikasiItem from "./NotifikasiItem";

export default function NotifikasiList({ data }: { data: any[] }) {
  return (
    <div className="mt-4 space-y-2">
      {data.map((notif) => (
        <NotifikasiItem key={notif.id} notif={notif} />
      ))}
    </div>
  );
}
