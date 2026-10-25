import { ComponentType, JSX, RenderableProps } from 'preact';
import { Suspense } from 'preact/compat';
import { Route, Router, lazy as loafing, useRoute } from 'preact-iso';
import Loader from '../Loader';

function lazy<T>(loader: () => Promise<{ default: T }> | { default: T }): T {
    if (process.env.BUILD_SSR) {
        return (loader() as { default: T }).default;
    }

    return loafing(loader as () => Promise<{ default: T }>);
}

function suspenseWrapper<T>(Component: ComponentType<T>): (props: RenderableProps<T>) => JSX.Element {
    if (process.env.BUILD_SSR) {
        return (props: RenderableProps<T>): JSX.Element => (
            <main id="content">
                <Component {...props} />
            </main>
        );
    }

    return (props: RenderableProps<T>): JSX.Element => {
        const { path } = useRoute();
        return (
            <main id="content">
                <Suspense fallback={<Loader />}>
                    <Component key={path} {...props} />
                </Suspense>
            </main>
        );
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

const HomePage = suspenseWrapper(HomeRoute);
const LoginPage = suspenseWrapper(LoginRoute);
const LogoutPage = suspenseWrapper(LogoutRoute);
const AuthPage = suspenseWrapper(AuthRoute);
const StartPage = suspenseWrapper(StartRoute);
const CheckCriminalPage = suspenseWrapper(CheckCriminalRoute);
const AboutPage = suspenseWrapper(AboutRoute);
const CrimesPage = suspenseWrapper(CrimesRoute);
const GroundsPage = suspenseWrapper(GroundsRoute);
const ComplaintsPage = suspenseWrapper(ComplaintsRoute);
const AddCriminalPage = suspenseWrapper(AddCriminalRoute);
const FourOhFourPage = suspenseWrapper(FourOhFourRoute);

export default function AppRouter(): JSX.Element {
    return (
        <Router>
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
    );
}
