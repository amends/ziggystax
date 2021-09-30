import useSWR from "swr";
import type { ERC20 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useMinter from "./useMinter";
import { parseBalance } from "../util";
import { BigNumber } from "ethers";

function getBAL(contract: any, address: any) {
  return async (_: string, address: string) => {
    const bal = await contract.etPotsSinceBake(address);
    const sell = await contract.calculatePotsSell(bal);
    // const final = (Number(sell) * 0.95).toFixed(0)
    return parseBalance(sell, 18, 2)
  };
}

export default function useBAL(
  address: string,
  suspense = false
) {
  const contract = useMinter();

  const shouldFetch =
    typeof address === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["myBAL", address] : null,
    getBAL(contract, address),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}