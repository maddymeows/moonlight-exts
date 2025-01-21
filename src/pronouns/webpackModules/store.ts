import Flux, { Store } from "@moonlight-mod/wp/discord/packages/flux";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";

const TTL = 604800000; // 1w

type UserProfileFetchSuccessEvent = {
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
  };
};

const cache: Cache = {};

class PronounsStore_ extends (Flux.PersistedStore as typeof Store)<unknown> {
  static displayName = "PronounsStore";
  static persistKey = "PronounsStore";

  constructor() {
    // @ts-expect-error: be normal
    super(Dispatcher, {
      USER_PROFILE_FETCH_SUCCESS: (event: UserProfileFetchSuccessEvent) => {
        cache[event.user.id] = {
          pronouns: event.user_profile.pronouns,
          lastFetched: Date.now()
        };
        if (event.guild_member_profile) {
          cache[`${event.user.id}-${event.guild_member_profile.guild_id}`] = {
            pronouns: event.guild_member_profile.pronouns,
            lastFetched: Date.now()
          };
        }
      }
    });
  }

  initialize(state?: Cache) {
    for (const [id, cached] of Object.entries(cache)) {
      if ((cached?.lastFetched ?? 0) + TTL > Date.now()) {
        cache[id] = cached;
      }
    }
  }

  getState() {
    return cache;
  }

  getPronouns(user: string, guild?: string | null) {
    return cache[`${user}-${guild}`]?.pronouns || cache[user]?.pronouns;
  }
}

export const PronounsStore = new PronounsStore_();
