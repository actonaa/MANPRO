import Card from "../../components/card/CardDshbrd";

export default function Beranda() {
  return (
    <div className="min-h-screen bg-[#F0F0F0] bg-top bg-no-repeat  bg-[length:100%_22%]">
      {/* Main Content */}
      <main className="px-8 py-4">
        {/* Logo Center */}
        <div className="flex justify-center mb-2 gap-6">
          <Card
            title="Aset aktif"
            value={200}
            icon="/img/Assets.png"
            color="bg-accent"
          />
          <Card
            title="Aset rusak"
            value={24}
            icon="/img/Risiko.png"
            color="bg-[#FFA0A0]"
          />
          <Card
            title="Nilai aset"
            value="13m"
            icon="/img/Nilai.png"
            color="bg-[#8FED8E]"
          />
        </div>
      </main>
    </div>
  );
}
