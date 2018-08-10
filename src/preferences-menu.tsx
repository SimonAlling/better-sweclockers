import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "text";
import { is, isString } from "ts-type-guards";
import { h, render } from 'preact';
import { log, logInfo, logWarning, logError } from "userscripter/logging";
import P from "preferences";
import { Preferences } from "userscripter/preference-handling";
import {
    AllowedTypes,
    FromString,
    PreferencesObject,
    PreferenceGroup,
    Preference,
    BooleanPreference,
    IntegerPreference,
    DoublePreference,
    StringPreference,
    IntegerRangePreference,
    DoubleRangePreference,
    MultichoicePreference,
} from "ts-preferences";
import { TimePreference } from "./preferences/TimePreference";
import * as EditingTools from "./operations/insert-editing-tools";

interface Generators {
    Boolean: (p: BooleanPreference) => JSX.Element
    String: (p: StringPreference) => JSX.Element
    Integer: (p: IntegerPreference) => JSX.Element
    Double: (p: DoublePreference) => JSX.Element
    Time: (p: TimePreference) => JSX.Element
    IntegerRange: (p: IntegerRangePreference) => JSX.Element
    DoubleRange: (p: DoubleRangePreference) => JSX.Element
    Multichoice: <T extends AllowedTypes>(p: MultichoicePreference<T>) => JSX.Element
}

const PREFIX_ID = CONFIG.PREFIX_ID + "option-";
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

export const menuGenerator = menuGeneratorWith(GENERATORS);

export function menuGeneratorWith(generators: Generators): (ps: PreferencesObject) => HTMLElement {
    return (ps: PreferencesObject) => {
        const header = (
            <header>
                <a href={document.referrer || "/"} title={T.preferences.back_to_sweclockers}>
                    <img src={CONFIG.URL_LOGO} alt={CONFIG.USERSCRIPT_NAME} />
                </a>
            </header>
        );
        const footer = (
            <footer>
                <p>{T.preferences.save_notice}</p>
                <p>
                    <a href={document.referrer || "/"} title={T.preferences.back_to_sweclockers}>
                        {T.preferences.back_to_sweclockers}
                    </a>
                </p>
            </footer>
        );
        const form = document.createElement("form");
        form.id = CONFIG.USERSCRIPT_ID;
        render(header, form);
        Entries(generators, ps).forEach(entry => {
            render(entry, form);
        });
        form.addEventListener("submit", e => {
            e.preventDefault();
        })
        render(footer, form);
        return form;
    };
}

function changeHandler(handler: EventHandlerNonNull): EventHandlerNonNull {
    return (e: Event) => {
        handler(e);
        const editingTools = document.getElementById(CONFIG.ID.editingTools);
        if (is(HTMLElement)(editingTools)) {
            render(EditingTools.fake(), editingTools.parentElement as HTMLElement, editingTools);
            if (Preferences.get(P.editing_tools._.enable)) {
                editingTools.classList.remove(CONFIG.CLASS.disabled);
            } else {
                editingTools.classList.add(CONFIG.CLASS.disabled);
            }
        }
    };
}

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

function prefixedId(id: string): string {
    return PREFIX_ID + id;
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
                <div id={prefixedId(p.key)} class={[CONFIG.CLASS.preference].concat(p.extras.class || "").join(" ")}>
                    {InputElement(generators, p)}
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
                    ? EditingTools.fake()
                    : null
                }
            </fieldset>
        );
}

function InputElement<T extends AllowedTypes>(generators: Generators, p: Preference<T>): JSX.Element {
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
    throw `Unsupported preference: ${p.getType()} (with key '${p.key}')`;
}

function Generator_Boolean(p: BooleanPreference): JSX.Element {
    return (
        <label>
            <input type="checkbox" checked={Preferences.get(p)} onChange={changeHandler(e => {
                Preferences.set(p, (e.target as HTMLInputElement).checked);
            })} />
            {p.label}
        </label>
    );
}

function Generator_String(p: StringPreference): JSX.Element {
    return (
        <label>
            {p.label}
            {p.multiline
                ?
                <textarea
                    value={Preferences.get(p)}
                    onChange={changeHandler(fromStringEventHandler<HTMLTextAreaElement, string, StringPreference>(p))}
                ></textarea>
                :
                <input
                    type="text"
                    value={Preferences.get(p)}
                    onChange={changeHandler(fromStringEventHandler<HTMLInputElement, string, StringPreference>(p))}
                />
            }
        </label>
    );
}

function Generator_Integer(p: IntegerPreference): JSX.Element {
    return (
        <label>
            {p.label}
            <input
                type="number"
                value={Preferences.get(p).toString()}
                onChange={changeHandler(fromStringEventHandler<HTMLInputElement, number, IntegerPreference>(p))}
            />
        </label>
    );
}

function Generator_Double(p: DoublePreference): JSX.Element {
    return (
        <label>
            {p.label}
            <input
                type="number"
                value={Preferences.get(p).toString()}
                step={RANGE_MAX_STEP}
                onChange={changeHandler(fromStringEventHandler<HTMLInputElement, number, DoublePreference>(p))}
            />
        </label>
    );
}

function Generator_Time(p: TimePreference): JSX.Element {
    return (
        <label>
            {p.label}
            <input
                type="time"
                value={p.stringify(Preferences.get(p))}
                onChange={changeHandler(fromStringEventHandler<HTMLInputElement, number, TimePreference>(p))}
            />
        </label>
    );
}

function Generator_IntegerRange(p: IntegerRangePreference): JSX.Element {
    return (
        <label>
            {p.label}
            <input
                type="number"
                value={Preferences.get(p).toString()}
                min={p.min}
                max={p.max}
                onChange={changeHandler(fromStringEventHandler<HTMLInputElement, number, IntegerRangePreference>(p))}
            />
        </label>
    );
}

function Generator_DoubleRange(p: DoubleRangePreference): JSX.Element {
    return (
        <label>
            {p.label}
            <input
                type="number"
                value={Preferences.get(p).toString()}
                min={p.min}
                max={p.max}
                step={stepSize(p.min, p.max).toString()}
                onChange={changeHandler(fromStringEventHandler<HTMLInputElement, number, DoubleRangePreference>(p))}
            />
        </label>
    );
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
                <span>{p.label}</span>
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
            <select onChange={changeHandler(e => {
                const index = (e.target as HTMLSelectElement).selectedIndex;
                if (index >= 0 && index < options.length) {
                    Preferences.set(p, options[index].value);
                }
            })}>
                {options.map(option => <option selected={option.value === savedValue}>{option.label}</option>)}
            </select>
        );
}

function RadioButton<T extends AllowedTypes>({ p, label, value, checked }: { p: MultichoicePreference<T>, label: string, value: T, checked: boolean }): JSX.Element {
    return (
        <label>
            <input
                type="radio"
                name={prefixedId(p.key)}
                checked={checked}
                onChange={changeHandler(e => {
                    if ((e.target as HTMLInputElement).checked) {
                        Preferences.set(p, value);
                    }
                })}
            />
            {label}
        </label>
    );
}
