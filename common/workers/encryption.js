import { expose } from 'threads/worker';
import { encryptItem } from 'common/utils/cipherUtils';

// eslint-disable-next-line
self.window = self;

const encryption = {
  async encryptAll(pairs) {
    console.log('encryptAll pairs', pairs);
    // eslint-disable-next-line
    return await Promise.all(
      pairs.map(async ({ item, user }) => {
        const data = await encryptItem(item.data, user.publicKey);

        console.log('data', data);

        return {
          itemId: item.id,
          userId: user.id,
          teamId: user.teamId,
          secret: data,
        };
      }),
    );
  },
};

expose(encryption);
