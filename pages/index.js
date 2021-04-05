import * as React from "react";
import Image from "next/image";
import useSwr from "swr";
import { getEggs } from "./api/eggs";

const fetcher = (...args) => fetch(...args).then((resp) => resp.json());

function Egg({ data }) {
  const { title, requrl } = data;
  return (
    <a href={requrl} target="_blank">
      {title ? title : <code>N/A</code>}
    </a>
  );
}

function Eggs({ data, error }) {
  if (error) return "Ooops, failed to fetch eggs.";
  if (!data) return "Loading...";
  return (
    <ol>
      {data.map((egg) => (
        <li>
          <Egg key={egg.requrl} data={egg} />
        </li>
      ))}
    </ol>
  );
}

function useCountdown(from) {
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setCount((count) => (count ? count - 1 : from)),
      1000
    );
    return () => clearInterval(intervalId);
  }, [setCount]);

  return count;
}

const refreshInSec = 60;

function HomePage({ eggs = [] }) {
  const { data, error } = useSwr("/api/eggs", fetcher, {
    initialData: eggs,
    refreshInterval: refreshInSec * 1000,
  });
  const countdown = useCountdown(refreshInSec);

  return (
    <>
      <h1>Netcup Easter Eggs</h1>
      <blockquote>
        Click the title, find the egg
        <Image
          src="/egg.svg"
          alt="Netcup Easter Egg Icon"
          width={30}
          height={37.8}
        />
        and click it!
      </blockquote>
      <div>Following list will be refreshed in {countdown}s</div>
      <Eggs data={data} error={error} />
    </>
  );
}

export async function getServerSideProps(context) {
  const eggs = await getEggs();
  return {
    props: { eggs },
  };
}

export default HomePage;
