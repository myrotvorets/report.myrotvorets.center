/* eslint-disable @typescript-eslint/ban-types */
import { ComponentType, RenderableProps, h } from 'preact';
import { Suspense, lazy as loafing } from 'preact/compat';
import { Route, Router } from 'preact-router';
import Loader from '../Loader';

function lazy<T>(loader: () => Promise<{ default: T }> | { default: T }): T {
    if (process.env.BUILD_SSR) {
        return (loader() as { default: T }).default;
    }

    return loafing(loader as () => Promise<{ default: T }>);
}

function suspenseWrapper<T>(Component: ComponentType<T>): (props: RenderableProps<T>) => h.JSX.Element {
    if (process.env.BUILD_SSR) {
        return (props: RenderableProps<T>): h.JSX.Element => (
            <main>
                <Component {...props} />
            </main>
        );
    }

    return (props: RenderableProps<T>): h.JSX.Element => (
        <main>
            <Suspense fallback={<Loader />}>
                <Component {...props} />
            </Suspense>
        </main>
    );
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

export default function AppRouter(): h.JSX.Element {
    return (
        <Router>
            <Route path="/" component={suspenseWrapper<{}>(HomeRoute)} />
            <Route path="/login" component={suspenseWrapper(LoginRoute)} />
            <Route path="/logout" component={suspenseWrapper<{}>(LogoutRoute)} />
            <Route path="/auth" component={suspenseWrapper(AuthRoute)} />
            <Route path="/start" component={suspenseWrapper(StartRoute)} />
            <Route path="/update/check" component={suspenseWrapper(CheckCriminalRoute)} />
            <Route path="/about/complaints" component={suspenseWrapper(ComplaintsRoute)} />
            <Route path="/about/crimes" component={suspenseWrapper(CrimesRoute)} />
            <Route path="/about/grounds" component={suspenseWrapper(GroundsRoute)} />
            <Route path="/about" component={suspenseWrapper(AboutRoute)} />
            <Route path="/criminal/add" component={suspenseWrapper(AddCriminalRoute)} mode="add" />
            <Route path="/criminal/update/:id" component={suspenseWrapper(AddCriminalRoute)} mode="update" />
            <Route default component={suspenseWrapper(FourOhFourRoute)} />
        </Router>
    );
}
