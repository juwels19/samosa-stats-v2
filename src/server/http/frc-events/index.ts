"use server";

import axios from "axios";
// import { unstable_cacheLife as cacheLife } from "next/cache";

const authorizationCredential = btoa(
  `${process.env.FRC_EVENTS_USERNAME}:${process.env.FRC_EVENTS_API_TOKEN}`
);

const FrcEventsInstance = axios.create({
  baseURL: "https://frc-api.firstinspires.org/v3.0",
  timeout: 5000,
  headers: {
    Authorization: `Basic ${authorizationCredential}`,
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
  // "use cache";
  // cacheLife("hours");
  const result = await FrcEventsInstance.get(`/${year}`);
  return result.data;
}

export async function fetchDistrictsByYear(year: string) {
  // "use cache";
  // cacheLife("weeks");
  type DistrictsListType = {
    districts: { code: string; name: string }[];
    districtCount: number;
  };
  const { data: districts } = await FrcEventsInstance.get<DistrictsListType>(
    `/${year}/districts`
  );
  return districts;
}

export async function fetchEventByYearAndCode(year: string, eventCode: string) {
  const { data: eventData } = await FrcEventsInstance.get(
    `/${year}/events?eventCode=${eventCode}`
  );
  return eventData.Events[0];
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
  const { data } = await FrcEventsInstance.get(
    `/${eventCode.slice(0, 4)}/teams?eventCode=${eventCode.slice(4)}`
  );
  return data.teams;
}

export default FrcEventsInstance;
