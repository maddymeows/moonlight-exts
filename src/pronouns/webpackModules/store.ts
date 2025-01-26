import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import Flux from "@moonlight-mod/wp/discord/packages/flux";

const FETCHED_TTL = 86400000 * 28; // 4 weeks
const SEEN_TTL = 86400000 * 7; // 4 weeks

type UserProfileFetchSuccessEvent = {
  type: "USER_PROFILE_FETCH_SUCCESS";
  user: {
    id: string;
  };
  user_profile: {
    pronouns: string;
  };
  guild_member_profile?: {
    guild_id: string;
    pronouns: string;
  };
};

type Cache = {
  [_ in string]?: {
    pronouns: string;
    lastFetched: number;
    lastSeen: number;
  };
};

const cache: Cache = {};

class PronounsStore_ extends Flux.PersistedStore<
  UserProfileFetchSuccessEvent,
  Cache
> {
  static displayName = "PronounsStore";
  static persistKey = "PronounsStore";

  constructor() {
    super(Dispatcher, {
      USER_PROFILE_FETCH_SUCCESS: (event: UserProfileFetchSuccessEvent) => {
        cache[event.user.id] = {
          pronouns: event.user_profile.pronouns,
          lastFetched: Date.now(),
          lastSeen: Date.now(),
        };
        if (event.guild_member_profile) {
          cache[`${event.user.id}-${event.guild_member_profile.guild_id}`] = {
            pronouns: event.guild_member_profile.pronouns,
            lastFetched: Date.now(),
            lastSeen: Date.now(),
          };
        }
      },
    });
  }

  initialize(state?: Cache) {
    for (const [id, cached] of Object.entries(state ?? "")) {
      if (
        Math.max(
          (cached?.lastFetched ?? 0) + FETCHED_TTL,
          (cached?.lastSeen ?? 0) + SEEN_TTL,
        ) > Date.now()
      ) {
        cache[id] = cached;
      }
    }
  }

  getState() {
    return cache;
  }

  getPronouns(user: string, guild?: string | null) {
    const userEntry = cache[user];
    if (userEntry) {
      userEntry.lastSeen = Date.now();
    }

    const memberEntry = cache[`${user}-${guild}`];
    if (memberEntry) {
      memberEntry.lastSeen = Date.now();
    }

    return memberEntry?.pronouns || userEntry?.pronouns;
  }
}

export const PronounsStore = new PronounsStore_();
