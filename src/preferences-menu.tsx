import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "selectors";
import * as T from "text";
import { is, isString, only, isNull } from "ts-type-guards";
import { h, Component } from 'preact';
import classNames from "classnames";
import { compose } from "lib/utilities";
import { log, logInfo, logWarning, logError } from "userscripter/logging";
import P from "preferences";
import { Preferences, isFalse } from "userscripter/preference-handling";
import {
    AllowedTypes,
    FromString,
    PreferencesObject,
    PreferenceGroup,
    Preference,
    BooleanPreference,
    IntegerPreference,
    DoublePreference,
    ListPreference,
    StringPreference,
    IntegerRangePreference,
    DoubleRangePreference,
    MultichoicePreference,
} from "ts-preferences";
import { TimePreference } from "./preferences/TimePreference";
import { EditingTools, getEditingToolsConfig } from "operations/insert-editing-tools";
import { subscribe, unsubscribe } from "userscripter/preference-handling";

const PID: <T extends AllowedTypes>(p: Preference<T>) => string = compose(
    CONFIG.prefixer(CONFIG.ID.preferenceIdPrefix),
    p => p.key,
);

type GeneratorOutput = JSX.Element | ReadonlyArray<JSX.Element>

interface Generators {
    Boolean: (p: BooleanPreference) => GeneratorOutput
    String: (p: StringPreference) => GeneratorOutput
    Integer: (p: IntegerPreference) => GeneratorOutput
    Double: (p: DoublePreference) => GeneratorOutput
    Time: (p: TimePreference) => GeneratorOutput
    IntegerRange: (p: IntegerRangePreference) => GeneratorOutput
    DoubleRange: (p: DoubleRangePreference) => GeneratorOutput
    Multichoice: <T extends AllowedTypes>(p: MultichoicePreference<T>) => GeneratorOutput
}

const RANGE_MAX_STEP = 0.1;
const RANGE_MIN_NUMBER_OF_STEPS = 100;

export const GENERATORS: Generators = {
    Boolean: Generator_Boolean,
    String: Generator_String,
    Integer: Generator_Integer,
    Double: Generator_Double,
    Time: Generator_Time,
    IntegerRange: Generator_IntegerRange,
    DoubleRange: Generator_DoubleRange,
    Multichoice: Generator_Multichoice,
};

function fromStringEventHandler<
    E extends HTMLElement & { value: string },
    T extends AllowedTypes,
    P extends Preference<T> & FromString<T>,
>(p: P): EventHandlerNonNull {
    return (e: Event) => {
        const parsed = p.fromString((e.target as E).value);
        if (isString(parsed)) {
            logWarning(parsed);
        } else {
            Preferences.set(p, parsed.value);
        }
    };
}

export class PreferencesForm extends Component {
    render() {
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

    listener = () => {
        this.forceUpdate();
    }

    componentDidMount() {
        subscribe(this.listener);
    }

    componentWillUnmount() {
        unsubscribe(this.listener);
    }
}

function Entries(generators: Generators, ps: PreferencesObject): ReadonlyArray<JSX.Element | null> {
    return Object.keys(ps).map(k => Entry(generators, ps[k]));
}

function Entry<T extends AllowedTypes>(generators: Generators, p: Preference<T> | PreferenceGroup): JSX.Element | null {
    return p instanceof Preference
        ? (
            p.extras.implicit // should not be part of the preferences menu
            ? null
            : (
                <div class={classNames(CONFIG.CLASS.preference, p.extras.class)}>
                    {InputElement(generators, p)}
                    {isString(p.extras.suffix) ? <HtmlLabel for={PID(p)} html={p.extras.suffix} /> : null}
                    {
                        p.description.length > 0
                        ? <aside
                            dangerouslySetInnerHTML={{__html: p.description}}
                            class={CONFIG.CLASS.preferenceDescription}
                        />
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
                        disabled={isFalse(Preferences.get(P.editing_tools._.enable))}
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
    throw `Unsupported preference: ${p.getType()} (with key '${p.key}')`;
}

function Generator_Boolean(p: BooleanPreference): GeneratorOutput {
    return [
        <input type="checkbox" id={PID(p)} checked={Preferences.get(p)} onChange={e => {
            Preferences.set(p, (e.target as HTMLInputElement).checked);
        }} />,
        <PreferenceLabel preference={p} />,
    ];
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

function RadioButton<T extends AllowedTypes>({ p, label, value, checked }: { p: MultichoicePreference<T>, label: string, value: T, checked: boolean }): ReadonlyArray<JSX.Element> {
    const radioButtonId = PID(p) + "-" + label;
    return [
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
        <HtmlLabel for={radioButtonId} html={label} />,
    ];
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
        status: "success", categories: ReadonlyArray<ForumCategory>
    } | {
        status: "loading"
    } | {
        status: "failure"
    }
}

class Interests extends Component<{ p: ListPreference<number> }, InterestsState> {
    state: InterestsState = { fetch: { status: "loading" } }

    componentDidMount() {
        fetch(SITE.PATH.FORUM)
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
                            logError(`Could not extract forum link data from this link:`);
                            console.error(forumLink);
                            return undefined;
                        }
                        return linkData;
                    })
                    .filter(isDefined)
                ),
            }});
        }).catch(reason => {
            logError(reason);
            this.setState({ fetch: { status: "failure" }})
        });
    }

    render() {
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
    render() {
        return <HtmlLabel for={PID(this.props.preference)} html={this.props.preference.label} />;
    }
}

class HtmlLabel extends Component<{ html: string, for?: string }> {
    render() {
        return <label for={this.props.for} dangerouslySetInnerHTML={{ __html: this.props.html }} />;
    }
}
