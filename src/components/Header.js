import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppStyles } from '../AppStyles';

const Header = ({ title }) => {
    const navigation = useNavigation();

    return (
        <Appbar.Header style={styles.appBar}>
            <Appbar.Action
                icon="menu"
                onPress={() => navigation.openDrawer()}
                iconColor={AppStyles.color.white}
                style={{ marginLeft: AppStyles.size.width * 0.05 }}
            />
            <Appbar.Content
                title={title}
                titleStyle={styles.appBarTitle}
            />
        </Appbar.Header>
    );
}

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: AppStyles.color.primary,
        elevation: 4,
    },
    appBarTitle: {
        color: AppStyles.color.white,
        fontSize: AppStyles.fontSize.title,
        fontWeight: '600',
    },
});

export default Header;
