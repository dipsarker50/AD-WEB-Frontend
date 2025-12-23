import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>
        <h1 >
          Welcome to AgriMarket
          </h1>
        <p>
          Your one-stop solution for agricultural products and services.
        </p>
        <div>
          <Image
            src="/landingPage-1.jpg"
            alt="Agriculture"
            width={600}
            height={400}
          />
        </div>
        <Agent name="Dip" />
      </div>
    </div>
  );
}

export function Agent({name}: {name?: string}) {
  return (
    <div>
      <h4>Agent Overview</h4>
      <p>This AgriMarket focus on customer and farmers end to end supports. Agent plays a significant role in facilitating these interactions.They provide the facility and competitve price range on each products</p>
      one of agent name is {name ? name : 'John Doe'}

    </div>
  );
}