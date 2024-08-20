import { PencilSquareIcon } from "@heroicons/react/20/solid";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getUserById } from "~/models/user.server";
import { requireUser } from "~/session.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
    const user = await requireUser(request);
    const profileUser = await getUserById(params.userId!);

    if (!profileUser) {
        throw new Error("User not found");
    }

    if (!user.isAdmin && user.id !== profileUser.id) {
        throw new Error("Unauthorized");
    }

    return json({ user, profileUser });
}

export default function UserProfile() {
    const data = useLoaderData<typeof loader>();
    return (
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
                <Link to={`/dashboard/${data.profileUser.id}/edit`} className="inline-flex items-center gap-x-1.5 text-sm font-medium text-blue-500 hover:text-blue-600">
                    <PencilSquareIcon className="h-8 w-8 text-gray-400 absolute right-10" aria-hidden="true" />
                </Link>
                <h2 className="text-base font-semibold leading-7 ">Profile</h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                    Your profile details are private and only visible to you and authorized personnel.
                </p>
                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                    <div className="pt-6 sm:flex">
                    <dt className="font-medium  sm:w-64 sm:flex-none sm:pr-6">
                        Name
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="">{data.profileUser.profile?.name}</div>
                    </dd>
                    </div>
                    <div className="pt-6 sm:flex">
                    <dt className="font-medium  sm:w-64 sm:flex-none sm:pr-6">
                        Email address
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="">{data.profileUser.email}</div>
                    </dd>
                    </div>
                    <div className="pt-6 sm:flex">
                    <dt className="font-medium  sm:w-64 sm:flex-none sm:pr-6">
                        Employee Code
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="">{data.profileUser.profile?.employeeCode}</div>
                    </dd>
                    </div>
                    <div className="pt-6 sm:flex">
                    <dt className="font-medium  sm:w-64 sm:flex-none sm:pr-6">
                        User Status
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="">{data.profileUser.isAdmin ? (
                            <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-s font-medium text-gray-400 ring-1 ring-inset ring-gray-200">
                                <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-blue-500">
                                    <circle cx="3" cy="3" r="3" />
                                </svg>
                                Admin
                            </span>
                        ): data.profileUser.status === "PENDING" ? (
                            <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-s font-medium text-gray-400 ring-1 ring-inset ring-gray-200">
                                <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-yellow-500">
                                    <circle cx="3" cy="3" r="3" />
                                </svg>
                                Pending
                            </span>
                        ): data.profileUser.status === "ACTIVE" ? (
                            <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-s font-medium text-gray-400 ring-1 ring-inset ring-gray-200">
                                <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-green-500">
                                    <circle cx="3" cy="3" r="3" />
                                </svg>
                                Active
                            </span>
                        ): data.profileUser.status === "INACTIVE" ? (
                            <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-s font-medium text-gray-400 ring-1 ring-inset ring-gray-200">
                                <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-red-500">
                                    <circle cx="3" cy="3" r="3" />
                                </svg>
                                Inactive
                            </span>
                        ): null}
                        </div>
                    </dd>
                    </div>
                </dl>
            </div>
        </div>
        </main>
    );
}
