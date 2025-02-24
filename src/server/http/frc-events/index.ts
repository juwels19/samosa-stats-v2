"use server";

import axios from "axios";
import { env } from "~/lib/env";

const authorizationCredential = btoa(
  `${env.FRC_EVENTS_USERNAME}:${env.FRC_EVENTS_API_TOKEN}`
);

const FrcEventsInstance = axios.create({
  baseURL: "https://frc-api.firstinspires.org/v3.0",
  timeout: 5000,
  headers: {
    Authorization: `Basic ${authorizationCredential}`,
  },
});

const fetchFrcEvents = async (
  url: string,
  method: string,
  cache?:
    | "default"
    | "no-store"
    | "reload"
    | "no-cache"
    | "force-cache"
    | "only-if-cached"
) =>
  fetch(`https://frc-api.firstinspires.org/v3.0${url}`, {
    method,
    headers: {
      Authorization: `Basic ${authorizationCredential}`,
    },
    cache,
    next: {
      revalidate: 60 * 10, // 10 minutes
    },
  });

export type FrcEvents_Season = {
  eventCount: number;
  gameName: string;
  kickoff: string;
  rookieStart: number;
  teamCount: number;
  frcChampionships: {
    name: string;
    startDate: string;
    location: string;
  }[];
};

export async function fetchSeasonInfoByYear(
  year: string
): Promise<FrcEvents_Season> {
  const result = await fetchFrcEvents(`/${year}`, "GET");

  const data = await result.json();
  return data;
}

export async function fetchDistrictsByYear(year: string) {
  type DistrictsListType = {
    districts: { code: string; name: string }[];
    districtCount: number;
  };
  const response = await fetchFrcEvents(`/${year}/districts`, "GET");

  const districts: DistrictsListType = await response.json();
  return districts;
}

export async function fetchEventByYearAndCode(year: string, eventCode: string) {
  try {
    const response = await fetchFrcEvents(
      `/${year}/events?eventCode=${eventCode}`,
      "GET"
    );
    const eventData = await response.json();
    return eventData.Events[0];
  } catch {
    throw new Error(`${eventCode} does not exist for the ${year} season.`);
  }
}

export type FrcEvents_Teams = {
  schoolName: string;
  website: string;
  homeCMP: string;
  teamNumber: number;
  nameFull: string;
  nameShort: string;
  city: string;
  stateProv: string;
  country: string;
  rookieYear: number;
  robotName: string;
  districtCode: string;
}[];

export async function fetchTeamsForEvent(
  eventCode: string
): Promise<FrcEvents_Teams> {
  const response = await fetchFrcEvents(
    `/${eventCode.slice(0, 4)}/teams?eventCode=${eventCode.slice(4)}`,
    "GET"
  );
  const data = await response.json();
  return data.teams;
}

export default FrcEventsInstance;
