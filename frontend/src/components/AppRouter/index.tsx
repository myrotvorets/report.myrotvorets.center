import { ComponentType, JSX, RenderableProps, createContext } from 'preact';
import { useCallback, useContext, useMemo, useState } from 'preact/hooks';
import { Route, Router, lazy as loafing, useRoute } from 'preact-iso';
import Alert from '../Alert';

interface Props {
    workerError?: Error;
}

const WorkerErrorContext = createContext<Error | undefined>(undefined);
WorkerErrorContext.displayName = 'WorkerErrorContext';

function lazy<T>(loader: () => Promise<{ default: T }> | { default: T }): T {
    if (process.env.BUILD_SSR) {
        return (loader() as { default: T }).default;
    }

    return loafing(loader as () => Promise<{ default: T }>);
}

function pageWrapper<T>(
    Component: ComponentType<T>,
    requiresWorker = false,
): (props: RenderableProps<T>) => JSX.Element {
    return (props: RenderableProps<T>): JSX.Element => {
        const { path } = useRoute();
        const workerError = useContext(WorkerErrorContext);
        if (requiresWorker && workerError) {
            return (
                <Alert message="Не вдалося підключитися до сервісу входу та надсилання повідомлень. Оновіть сторінку та спробуйте ще раз." />
            );
        }

        return <Component key={path} {...props} />;
    };
}

const HomeRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "home" */
            /* webpackPrefetch: true */
            '../../components/Home'
        ),
);

const LoginRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "login" */
            /* webpackPrefetch: true */
            '../../components/LoginForm'
        ),
);

const AuthRoute = process.env.BUILD_SSR
    ? (): null => null
    : lazy(
          () =>
              import(
                  /* webpackChunkName: "login" */
                  /* webpackPrefetch: true */
                  '../../components/Authenticator'
              ),
      );

const LogoutRoute = process.env.BUILD_SSR
    ? (): null => null
    : lazy(
          () =>
              import(
                  /* webpackChunkName: "logout" */
                  /* webpackMode: "eager" */
                  '../../components/Logout'
              ),
      );

const StartRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "start" */
            /* webpackPrefetch: true */
            '../../components/StartForm'
        ),
);

const CheckCriminalRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "criminal" */
            /* webpackPrefetch: true */
            '../../components/CheckCriminalForm'
        ),
);

const AddCriminalRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "criminal" */
            /* webpackPrefetch: true */
            '../../components/InfoForm'
        ),
);

const AboutRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "static" */
            '../Static/About'
        ),
);

const CrimesRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "legal" */
            '../Static/Crimes'
        ),
);

const GroundsRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "legal" */
            '../Static/Grounds'
        ),
);

const ComplaintsRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "static" */
            '../Static/Complaints'
        ),
);

const FourOhFourRoute = lazy(() => import(/* webpackMode: "eager" */ '../../components/FourOhFour'));

const HomePage = pageWrapper(HomeRoute);
const LoginPage = pageWrapper(LoginRoute, true);
const LogoutPage = pageWrapper(LogoutRoute, true);
const AuthPage = pageWrapper(AuthRoute, true);
const StartPage = pageWrapper(StartRoute, true);
const CheckCriminalPage = pageWrapper(CheckCriminalRoute, true);
const AboutPage = pageWrapper(AboutRoute);
const CrimesPage = pageWrapper(CrimesRoute);
const GroundsPage = pageWrapper(GroundsRoute);
const ComplaintsPage = pageWrapper(ComplaintsRoute);
const AddCriminalPage = pageWrapper(AddCriminalRoute, true);
const FourOhFourPage = pageWrapper(FourOhFourRoute);

export default function AppRouter({ workerError }: Readonly<Props>): JSX.Element {
    const [loading, setLoading] = useState(false);
    const onLoadStart = useCallback((): void => setLoading(true), []);
    const onLoadEnd = useCallback((): void => setLoading(false), []);

    // Keep the Router vnode stable while its loading indicator updates.
    const routes = useMemo(
        () => (
            <Router onLoadStart={onLoadStart} onLoadEnd={onLoadEnd}>
                <Route path="/" component={HomePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/logout" component={LogoutPage} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/start" component={StartPage} />
                <Route path="/update/check" component={CheckCriminalPage} />
                <Route path="/about/complaints" component={ComplaintsPage} />
                <Route path="/about/crimes" component={CrimesPage} />
                <Route path="/about/grounds" component={GroundsPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/criminal/add" component={AddCriminalPage} mode="add" />
                <Route path="/criminal/update/:id" component={AddCriminalPage} mode="update" />
                <Route default component={FourOhFourPage} />
            </Router>
        ),
        [onLoadStart, onLoadEnd],
    );

    return (
        <WorkerErrorContext.Provider value={workerError}>
            <main id="content" aria-busy={loading}>
                {loading && <output>Завантаження сторінки…</output>}
                {routes}
            </main>
        </WorkerErrorContext.Provider>
    );
}
