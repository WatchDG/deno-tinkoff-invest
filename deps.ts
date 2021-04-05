export {
  fail,
  ok,
  tryCatch,
  tryCatchAsync,
} from "https://deno.land/x/result@4.0.0/mod.ts";
import { types } from "https://deno.land/x/result@4.0.0/mod.ts";
export type Result<DataType, ErrorType> = types.Result<DataType, ErrorType>;
export type ResultAsync<DataType, ErrorType> = types.ResultAsync<
  DataType,
  ErrorType
>;
export { Instance } from "https://deno.land/x/http_instance@1.2.0/mod.ts";
