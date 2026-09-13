export function toUserDTO(user: any) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function toPublicPropertyDTO(property: any) {
  if (!property) return null;
  const {
    isDuplicateCandidate,
    duplicateSimilarity,
    duplicateCandidateId,
    ...publicProp
  } = property;

  return publicProp;
}

export function toPublicPropertyListDTO(properties: any[]) {
  return properties.map(toPublicPropertyDTO);
}