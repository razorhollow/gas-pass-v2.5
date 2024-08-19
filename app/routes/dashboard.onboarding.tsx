//create a loader and default function to collect the first name, last name, and employee id. Create an action function to update the user profile with the collected data.

import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { updateUserProfile } from "~/models/user.server";
import { requireUser } from "~/session.server";
import { safeRedirect } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireUser(request);
    return json({ user });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireUser(request);
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const employeeId = formData.get("employeeId");

    if (typeof firstName !== "string" || firstName.length === 0) {
        return json(
        { errors: { firstName: "First name is required", lastName: null, employeeId: null } },
        { status: 400 },
        );
    }

    if (typeof lastName !== "string" || lastName.length === 0) {
        return json(
        { errors: { firstName: null, lastName: "Last name is required", employeeId: null } },
        { status: 400 },
    );
    }

    if (typeof employeeId !== "string" || employeeId.length === 0) {
        return json(
        { errors: { firstName: null, lastName: null, employeeId: "Employee ID is required" } },
        { status: 400 },
    );
    }

    await updateUserProfile(user.id, { firstName, lastName, employeeId });

    return redirect(safeRedirect(formData.get("redirectTo"), "/dashboard"));
};

export default function UserProfile() {
    const actionData = useActionData<typeof action>();
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const employeeIdRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
    if (actionData?.errors?.firstName) {
        firstNameRef.current?.focus();
    } else if (actionData?.errors?.lastName) {
        lastNameRef.current?.focus();
    } else if (actionData?.errors?.employeeId) {
        employeeIdRef.current?.focus();
    }
    }, [actionData]);

    return (
    <Form
        method="post"
    >
        <div>
            <span>First Name: </span>
            <Input
                ref={firstNameRef}
                type="text"
                name="firstName"
                required
            />
        {actionData?.errors?.firstName ? (
            <div className="text-red-500">{actionData.errors.firstName}</div>
        ) : null}
        </div>
        <div>
            <span>Last Name: </span>
                <Input
                    ref={lastNameRef}
                    type="text"
                    name="lastName"
                    required
                />
        {actionData?.errors?.lastName ? (
            <div className="text-red-500">{actionData.errors.lastName}</div>
        ) : null}
        </div>
        <div>
            <span>Employee ID: </span>
            <Input
                ref={employeeIdRef}
                type="text"
                name="employeeId"
                required
            />
        {actionData?.errors?.employeeId ? (
            <div className="text-red-500">{actionData.errors.employeeId}</div>
        ) : null}
            </div>
            <Button type="submit">Update Profile</Button>
    </Form>
    );
}