import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

import { getUsers } from '~/models/user.server';
import { requireUser } from '~/session.server';

const statuses = {
    INNACTIVE: 'text-gray-500 bg-gray-100/10',
    ACTIVE: 'text-green-500 bg-green-400/10',
    PENDING: 'text-yellow-500 bg-yellow-400/10',
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireUser(request);

    if (user.isAdmin === false) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const users = await getUsers();
  // Retrieve data based on params or request
  // const data = await someDatabaseFunction(params.id);

    return json({ users });
};

export default function UsersIndex() {
    const data = useLoaderData<typeof loader>();
    console.log(data);
    if ('error' in data) {
        return <div>Error: {data.error}</div>;
    }
    return (
    <div>
        <ul className="divide-y divide-white/5">
            {data.users.map((user) => (
                <li key={user.id} className='relative flex items-center space-x-4 py-4'>
                    <div className="min-w-0 flex-auto">
                        <div className="flex items-center gap-x-3">
                            <div className={classNames(statuses[user.status], 'flx-none rounded-full p-1')}>
                                <div className="h-2 w-2 rounded-full bg-current" />
                            </div>
                            <h2 className='min-w-0 text-sm font-semibold leading-6 text-white'>
                                <Link to={`/dashboard/users/${user.id}`}>
                                    {user.profile?.name ? 
                                        <span className='truncate'>{user.profile.name}</span> :
                                        <span className='truncate'>User Request</span>
                                    }
                                    <span className="absolute inset-0" />
                                </Link>
                            </h2>
                        </div>
                        <div className='mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400'>
                            <p className='truncate'>{user.email}</p>
                            <svg viewBox="0 0 2 2" className='h-0.5 w-0.5 flex-none fill-gray-300'>
                                <circle r={1} cx={1} cy={1} />
                            </svg>
                            <p>Joined 1/1/2019</p>
                        </div>
                    </div>
                    <ChevronRightIcon aria-hidden='true' className='h-5 w-5 text-gray-400 flex-none' />
                </li>
            ))}
        </ul>
    </div>
    );
}