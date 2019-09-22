import * as T from "../text";
import {
    BooleanPreference,
} from "ts-preferences";

export default <const> {
    news_ticker: new BooleanPreference({
        key: "customize_content_news_ticker",
        default: true,
        label: T.preferences.customize_content.news_ticker,
    }),
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
    anniversary: new BooleanPreference({
        key: "customize_content_anniversary",
        default: true,
        label: T.preferences.customize_content.anniversary,
    }),
    guides: new BooleanPreference({
        key: "customize_content_guides",
        default: true,
        label: T.preferences.customize_content.guides,
    }),
    popular_galleries: new BooleanPreference({
        key: "customize_content_popular_galleries",
        default: true,
        label: T.preferences.customize_content.popular_galleries,
    }),
    new_in_forum_side: new BooleanPreference({
        key: "customize_content_new_in_forum_side",
        default: true,
        label: T.preferences.customize_content.new_in_forum_side,
    }),
    new_in_market: new BooleanPreference({
        key: "customize_content_new_in_market",
        default: true,
        label: T.preferences.customize_content.new_in_market,
    }),
    new_in_test_lab: new BooleanPreference({
        key: "customize_content_new_in_test_lab",
        default: true,
        label: T.preferences.customize_content.new_in_test_lab,
    }),
    in_the_store: new BooleanPreference({
        key: "customize_content_in_the_store",
        default: true,
        label: T.preferences.customize_content.in_the_store,
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
    more_articles: new BooleanPreference({
        key: "customize_content_more_articles",
        default: true,
        label: T.preferences.customize_content.more_articles,
    }),
    latest_news: new BooleanPreference({
        key: "customize_content_latest_news",
        default: true,
        label: T.preferences.customize_content.latest_news,
    }),
    new_in_forum_main: new BooleanPreference({
        key: "customize_content_new_in_forum_main",
        default: true,
        label: T.preferences.customize_content.new_in_forum_main,
    }),
    footer: new BooleanPreference({
        key: "customize_content_footer",
        default: true,
        label: T.preferences.customize_content.footer,
    }),
}
