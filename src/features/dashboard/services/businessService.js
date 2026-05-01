import { subscribeBusinessByUser } from "../repositories/businessRepository";

export function subscribeBusiness(uid, onNext, onError) {
  return subscribeBusinessByUser(uid, onNext, onError);
}
