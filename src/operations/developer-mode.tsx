import { Component, h, JSX, render } from "preact";
import * as Storage from "ts-storage";
import { log } from "userscripter";

import * as CONFIG from "~src/config";
import * as T from "~src/text";

export function logger(regularLogger: log.Logger, rootNode: Element): log.Logger {
    const initOpen = Storage.get_session(CONFIG.KEY.developer_tools_open, false).value;
    let devTools: DevTools;
    render(<DevTools initOpen={initOpen} ref={self => { devTools = self; }} />, rootNode);
    return {
        ...regularLogger,
        error: (prefix: string, message: string) => {
            devTools.log({ kind: "error", content: message });
            regularLogger.error(prefix, message);
        },
        warn: (prefix: string, message: string) => {
            devTools.log({ kind: "warning", content: message });
            regularLogger.warn(prefix, message);
        },
    };
}

type Kind = "error" | "warning"

type Message = {
    kind: Kind
    content: string
}

type DevToolsProps = {
    initOpen: boolean
}

type DevToolsState = {
    loggedMessages: readonly Message[]
    isOpen: boolean
}

class DevTools extends Component<DevToolsProps, DevToolsState> {
    constructor(props: DevToolsProps) {
        super(props);
        this.state = {
            loggedMessages: [],
            isOpen: props.initOpen,
        };
    }

    public log(message: Message) {
        this.setState(state => ({
            loggedMessages: [ ...state.loggedMessages, message ],
        }));
    }

    render() {
        const loggedMessages = this.state.loggedMessages;
        const loggedWarnings = loggedMessages.filter(msg => msg.kind === "warning");
        const loggedErrors = loggedMessages.filter(msg => msg.kind === "error");
        return (
            <footer id={CONFIG.ID.developerTools} class={this.state.isOpen ? "open" : undefined} data-how-many={loggedMessages.length}>
                <a onClick={_ => {
                    this.setState(state => {
                        const newOpenState = !state.isOpen;
                        Storage.set_session(CONFIG.KEY.developer_tools_open, newOpenState);
                        return { ...state, isOpen: newOpenState };
                    });
                }}>
                    {summary(loggedErrors.length, "error")}
                    {summary(loggedWarnings.length, "warning")}
                </a>
                <ol>
                    {
                        loggedMessages.length > 0
                            ? loggedMessages.map(msg => <li class={CONFIG.CLASS.developerTools[msg.kind]}>{msg.content}</li>)
                            : <li>{T.developer_mode.nothing_logged}</li>
                    }
                </ol>
            </footer>
        );
    }
}

function summary(howMany: number, what: Kind): JSX.Element {
    const icon = ({
        error: "❌",
        warning: "⚠️",
    } as const)[what];
    return (
        <strong data-how-many={howMany} class={CONFIG.CLASS.developerTools[what]} title={T.developer_mode.tooltip[what](howMany)}>
            {icon}&nbsp;&nbsp;{howMany}
        </strong>
    );
}
