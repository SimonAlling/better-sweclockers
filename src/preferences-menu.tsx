import classNames from "classnames";
import { Component, h } from "preact";
import {
    AllowedTypes,
    BooleanPreference,
    DoublePreference,
    DoubleRangePreference,
    FromString,
    IntegerPreference,
    IntegerRangePreference,
    ListPreference,
    MultichoicePreference,
    Preference,
    PreferenceGroup,
    PreferencesObject,
    StringPreference,
} from "ts-preferences";
import { is, isNull, isString, only } from "ts-type-guards";
import { log } from "userscripter";

import * as CONFIG from "~src/config";
import { EditingTools, getEditingToolsConfig } from "~src/operations/editing-tools";
import { P, Preferences, responseHandler } from "~src/preferences";
import { TimePreference } from "~src/preferences/TimePreference";
import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";
import * as T from "~src/text";

const PID = <T extends AllowedTypes>(p: Preference<T>) => CONFIG.ID.preferenceIdPrefix + p.key;

type GeneratorOutput = JSX.Element | readonly JSX.Element[]

const RANGE_MAX_STEP = 0.1;
const RANGE_MIN_NUMBER_OF_STEPS = 100;

export const GENERATORS = {
    Boolean: Generator_Boolean,
    String: Generator_String,
    Integer: Generator_Integer,
    Double: Generator_Double,
    Time: Generator_Time,
    IntegerRange: Generator_IntegerRange,
    DoubleRange: Generator_DoubleRange,
    Multichoice: Generator_Multichoice,
} as const;

type Generators = typeof GENERATORS;

function fromStringEventHandler<
    E extends HTMLElement & { value: string },
    T extends AllowedTypes,
    P extends Preference<T> & FromString<T>,
>(p: P): EventHandlerNonNull {
    return (e: Event) => {
        const parsed = p.fromString((e.target as E).value);
        if (isString(parsed)) {
            log.warning(parsed);
        } else {
            Preferences.set(p, parsed.value);
        }
    };
}

export class PreferencesForm extends Component {
    public render() {
        return (
            <form id={CONFIG.USERSCRIPT_ID}>
                <header>
                    <a href={document.referrer || "/"} title={T.preferences.back_to_sweclockers}>
                        <img src={CONFIG.URL_LOGO} alt={CONFIG.USERSCRIPT_NAME} />
                    </a>
                </header>
                {Entries(GENERATORS, P)}
                <footer>
                    <p>{T.preferences.save_notice}</p>
                    <p>
                        <a href={document.referrer || "/"} title={T.preferences.back_to_sweclockers}>
                            {T.preferences.back_to_sweclockers}
                        </a>
                    </p>
                </footer>
            </form>
        );
    }

    public componentDidMount() {
        // The listener can't be a method, because then `this` is undefined in it.
        responseHandler.subscribe(() => {
            this.forceUpdate();
        });
    }
}

function Entries(generators: Generators, ps: PreferencesObject): readonly (JSX.Element | null)[] {
    return Object.keys(ps).map(k => Entry(generators, ps[k]));
}

function Entry<T extends AllowedTypes>(generators: Generators, p: Preference<T> | PreferenceGroup): JSX.Element | null {
    return p instanceof Preference
        ? (
            p.extras.implicit // should not be part of the preferences menu
            ? null
            : (
                <div class={classNames(CONFIG.CLASS.preference, p.extras.class)} title={p.description}>
                    {InputElement(generators, p)}
                    {isString(p.extras.suffix) ? <HtmlLabel for={PID(p)} html={p.extras.suffix} /> : null}
                    {
                        p.extras.more !== undefined
                        ? <aside dangerouslySetInnerHTML={{__html: p.extras.more}} />
                        : null
                    }
                </div>
            )
        ) : (
            <fieldset class={SITE.CLASS.fieldset}>
                <legend>{p.label}</legend>
                {Entries(generators, p._)}
                {
                    p.extras && p.extras.id === CONFIG.ID.editingToolsPreferences
                    ? <EditingTools
                        textarea={document.createElement("textarea")}
                        config={getEditingToolsConfig()}
                        disabled={!Preferences.get(P.editing_tools._.enable)}
                        undoSupport={Preferences.get(P.advanced._.undo_support)}
                    />
                    : null
                }
            </fieldset>
        );
}

function InputElement<T extends AllowedTypes>(generators: Generators, p: Preference<T>): GeneratorOutput {
    // Order can be super-important here due to the semantics of instanceof with respect to subclasses.
    if (is(BooleanPreference)(p)) {
        return generators.Boolean(p);
    }
    if (is(StringPreference)(p)) {
        return generators.String(p);
    }
    if (is(IntegerPreference)(p)) {
        return generators.Integer(p);
    }
    if (is(DoublePreference)(p)) {
        return generators.Double(p);
    }
    if (is(TimePreference)(p)) {
        return generators.Time(p);
    }
    if (is(IntegerRangePreference)(p)) {
        return generators.IntegerRange(p);
    }
    if (is(DoubleRangePreference)(p)) {
        return generators.DoubleRange(p);
    }
    if (is(MultichoicePreference)(p)) {
        return generators.Multichoice(p);
    }
    if (is(ListPreference)(p) && p === P.interests._.uninteresting_subforums) {
        return <Interests p={p} />;
    }
    const msg = `Unsupported preference: ${p}`;
    log.error(msg);
    return <mark>{msg}</mark>;
}

function Generator_Boolean(p: BooleanPreference): GeneratorOutput {
    return LabeledInput(
        <input type="checkbox" id={PID(p)} checked={Preferences.get(p)} onChange={e => {
            Preferences.set(p, (e.target as HTMLInputElement).checked);
        }} />,
        p.label,
    );
}

function Generator_String(p: StringPreference): GeneratorOutput {
    return (
        p.label === T.preferences.NO_LABEL ? [] : [ <PreferenceLabel preference={p} /> ]
    ).concat([
        (p.multiline
            ?
            <textarea
                id={PID(p)}
                value={Preferences.get(p)}
                onChange={fromStringEventHandler<HTMLTextAreaElement, string, StringPreference>(p)}
            ></textarea>
            :
            <input
                type="text"
                id={PID(p)}
                value={Preferences.get(p)}
                onChange={fromStringEventHandler<HTMLInputElement, string, StringPreference>(p)}
            />
        ),
    ]);
}

function Generator_Integer(p: IntegerPreference): GeneratorOutput {
    return [
        <PreferenceLabel preference={p} />,
        <input
            type="number"
            id={PID(p)}
            value={Preferences.get(p).toString()}
            onChange={fromStringEventHandler<HTMLInputElement, number, IntegerPreference>(p)}
        />,
    ];
}

function Generator_Double(p: DoublePreference): GeneratorOutput {
    return [
        <PreferenceLabel preference={p} />,
        <input
            type="number"
            id={PID(p)}
            value={Preferences.get(p).toString()}
            step={RANGE_MAX_STEP}
            onChange={fromStringEventHandler<HTMLInputElement, number, DoublePreference>(p)}
        />,
    ];
}

function Generator_Time(p: TimePreference): GeneratorOutput {
    return [
        <PreferenceLabel preference={p} />,
        <input
            type="time"
            id={PID(p)}
            value={p.stringify(Preferences.get(p))}
            onChange={fromStringEventHandler<HTMLInputElement, number, TimePreference>(p)}
        />,
    ];
}

function Generator_IntegerRange(p: IntegerRangePreference): GeneratorOutput {
    return [
        <PreferenceLabel preference={p} />,
        <input
            type="number"
            id={PID(p)}
            value={Preferences.get(p).toString()}
            min={p.min}
            max={p.max}
            onChange={fromStringEventHandler<HTMLInputElement, number, IntegerRangePreference>(p)}
        />,
    ];
}

function Generator_DoubleRange(p: DoubleRangePreference): GeneratorOutput {
    return [
        <PreferenceLabel preference={p} />,
        <input
            type="number"
            id={PID(p)}
            value={Preferences.get(p).toString()}
            min={p.min}
            max={p.max}
            step={stepSize(p.min, p.max).toString()}
            onChange={fromStringEventHandler<HTMLInputElement, number, DoubleRangePreference>(p)}
        />,
    ];
}

function stepSize(min: number, max: number): number {
    return Math.min(
        RANGE_MAX_STEP,
        Math.pow(10, Math.floor(Math.log10(max - min))) / RANGE_MIN_NUMBER_OF_STEPS
    );
}

function Generator_Multichoice<T extends AllowedTypes>(p: MultichoicePreference<T>): JSX.Element {
    const MAX_RADIO_BUTTONS = 4;
    const savedValue = Preferences.get(p);
    const options = p.options;
    return options.length <= MAX_RADIO_BUTTONS
        ? (
            <fieldset class={CONFIG.CLASS.radioButtonPreference}>
                <HtmlLabel html={p.label} />
                {options.map(option =>
                    RadioButton({
                        p: p,
                        label: option.label,
                        value: option.value,
                        checked: option.value === savedValue,
                    })
                )}
            </fieldset>
        ) : (
            <select onChange={e => {
                const index = (e.target as HTMLSelectElement).selectedIndex;
                if (index >= 0 && index < options.length) {
                    Preferences.set(p, options[index].value);
                }
            }}>
                {options.map(option => <option selected={option.value === savedValue}>{option.label}</option>)}
            </select>
        );
}

function RadioButton<T extends AllowedTypes>({ p, label, value, checked }: { p: MultichoicePreference<T>, label: string, value: T, checked: boolean }): JSX.Element {
    const radioButtonId = PID(p) + "-" + label;
    return LabeledInput(
        <input
            type="radio"
            id={radioButtonId}
            name={PID(p)}
            checked={checked}
            onChange={e => {
                if ((e.target as HTMLInputElement).checked) {
                    Preferences.set(p, value);
                }
            }}
        />,
        label,
    );
}

function LabeledInput(input: JSX.Element, label: string): JSX.Element {
    return (
        // Cannot use HtmlLabel because we want to have the <input> inside the <label> to avoid a line break between them.
        <label class={ CONFIG.CLASS.labeledInput }>
            { input }
            <span dangerouslySetInnerHTML={{ __html: label }} />
        </label>
    );
}

function extractForumLinkData(forumLink: HTMLAnchorElement): ForumCategory | null {
    const match = forumLink.href.match(SITE.PATH.FORUM_CATEGORY);
    const label = forumLink.textContent;
    if (isNull(match) || isNull(label)) { return null; }
    const id = parseInt(match[1]);
    return {
        id,
        name: label,
        isSubforum: forumLink.classList.contains(SITE.CLASS.subforumLink),
    };
}

interface ForumCategory {
    id: number
    name: string
    isSubforum?: boolean
}

function isDefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

type InterestsState = {
    fetch: {
        status: "success", categories: readonly ForumCategory[],
    } | {
        status: "loading",
    } | {
        status: "failure",
    },
}

class Interests extends Component<{ p: ListPreference<number> }, InterestsState> {
    public state: InterestsState = { fetch: { status: "loading" } }

    public componentDidMount() {
        /*
        A relative path such as "/forum" works in Violentmonkey and Tampermonkey
        in both Chrome and Firefox, but not in Greasemonkey (Firefox).
        "https://" + SITE.HOSTNAME + path doesn't work in Chrome due to CORS.
        window.location.origin + path works in all five mentioned scenarios, as
        well as in Safari on iOS 12.3.
        */
        fetch(window.location.origin + SITE.PATH.FORUM)
        .then(response => response.text())
        .then(responseContent => {
            const responseDocument = new DOMParser().parseFromString(responseContent, "text/html");
            const links = responseDocument.querySelectorAll(SELECTOR.forumLink);
            this.setState({ fetch: {
                status: "success",
                categories: (
                    only(HTMLAnchorElement)(Array.from(links))
                    .filter(link => SITE.PATH.FORUM_CATEGORY.test(link.href))
                    .map(forumLink => {
                        const linkData = extractForumLinkData(forumLink);
                        if (isNull(linkData)) {
                            log.error(`Could not extract forum link data from this link:`);
                            console.error(forumLink);
                            return undefined;
                        }
                        return linkData;
                    })
                    .filter(isDefined)
                ),
            }});
        }).catch(reason => {
            log.error(reason);
            this.setState({ fetch: { status: "failure" }})
        });
    }

    public render() {
        const p = this.props.p;
        const uninteresting = Preferences.get(p);
        const response = this.state.fetch;
        switch (response.status) {
            case "loading":
                return T.general.loading;
            case "success":
                return (
                    <ul id={CONFIG.ID.interestsPreferences}>
                        {response.categories.map(category => {
                            const id = category.id;
                            const checkboxId = PID(p) + "-" + id;
                            return (
                                <li class={classNames({ [CONFIG.CLASS.subforum]: category.isSubforum })} key={id}>
                                    <input type="checkbox" id={checkboxId} checked={!uninteresting.includes(id)} onChange={e => {
                                        const newUninteresting = uninteresting.filter(x => x !== id).concat((e.target as HTMLInputElement).checked ? [] : id);
                                        Preferences.set(p, newUninteresting);
                                    }} />
                                    <HtmlLabel html={category.name} for={checkboxId} />
                                </li>
                            );
                        })}
                    </ul>
                );
            case "failure":
                return T.preferences.failed_to_fetch_categories;
        }
    }
}

class PreferenceLabel<T extends AllowedTypes> extends Component<{ preference: Preference<T> }> {
    public render() {
        return <HtmlLabel for={PID(this.props.preference)} html={this.props.preference.label} />;
    }
}

class HtmlLabel extends Component<{ html: string, for?: string }> {
    public render() {
        return <label for={this.props.for} dangerouslySetInnerHTML={{ __html: this.props.html }} />;
    }
}
