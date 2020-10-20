import { useService } from "jokits-react";
import { useEffect, useState } from "react";
import { User } from "../../models/User";

export default function useCurrentUser(): [User | null, ((action: string, data?: any) => void)] {
    const [data, send] = useService<User | null>("UserService");

    const [usr, setUsr] = useState<User | null>(null);
    
    useEffect(() => {
        if (data !== undefined) {
            setUsr(data);
        }
    }, [data]);

    return [usr, send];
}
