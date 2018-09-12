import * as T from "../text";
import {
    BooleanPreference,
} from "ts-preferences";

export default {
    carousel: new BooleanPreference({
        key: "customize_content_carousel",
        default: true,
        label: T.preferences.customize_content.carousel,
    }),
    social_media: new BooleanPreference({
        key: "customize_content_social_media",
        default: true,
        label: T.preferences.customize_content.social_media,
    }),
    latest_news: new BooleanPreference({
        key: "customize_content_latest_news",
        default: true,
        label: T.preferences.customize_content.latest_news,
    }),
    new_in_forum: new BooleanPreference({
        key: "customize_content_new_in_forum",
        default: true,
        label: T.preferences.customize_content.new_in_forum,
    }),
    popular_at_prisjakt: new BooleanPreference({
        key: "customize_content_popular_at_prisjakt",
        default: true,
        label: T.preferences.customize_content.popular_at_prisjakt,
    }),
    new_tech_jobs: new BooleanPreference({
        key: "customize_content_new_tech_jobs",
        default: true,
        label: T.preferences.customize_content.new_tech_jobs,
    }),
    external_news: new BooleanPreference({
        key: "customize_content_external_news",
        default: true,
        label: T.preferences.customize_content.external_news,
    }),
}
